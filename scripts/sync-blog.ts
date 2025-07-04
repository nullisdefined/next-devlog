import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import matter from "gray-matter";
import * as os from "os";

dotenv.config({ path: ".env.local" });

interface BlogSyncConfig {
  obsidianDir: string;
  nextContentDir: string;
}

interface FrontMatter {
  title: string;
  category?: string;
  slug?: string;
  tags?: string[] | string;
  [key: string]: any;
}

class BlogSync {
  private obsidianDir: string;
  private nextContentDir: string;
  private processedFiles: Set<string>;
  private existingNextPosts: Map<string, string>;

  constructor(config: BlogSyncConfig) {
    // 경로 정규화
    this.obsidianDir = path.resolve(this.normalizePath(config.obsidianDir));
    this.nextContentDir = path.resolve(
      this.normalizePath(config.nextContentDir)
    );
    this.processedFiles = new Set();
    this.existingNextPosts = new Map();

    this.initSync();
  }

  // 경로 정규화를 위한 새로운 메서드
  private normalizePath(inputPath: string): string {
    // 홈 디렉토리 처리 ('~' 확장)
    if (inputPath.startsWith("~")) {
      inputPath = inputPath.replace("~", os.homedir());
    }

    // 경로 구분자 정규화
    return path.normalize(inputPath);
  }

  private async initSync(): Promise<void> {
    // 디렉토리 존재 확인
    if (!fs.existsSync(this.obsidianDir)) {
      throw new Error(`Obsidian directory not found: ${this.obsidianDir}`);
    }
    if (!fs.existsSync(this.nextContentDir)) {
      throw new Error(
        `Next.js content directory not found: ${this.nextContentDir}`
      );
    }

    console.log(`Watching Obsidian directory: ${this.obsidianDir}`);
    console.log(`Syncing to Next.js content directory: ${this.nextContentDir}`);

    await this.scanNextContentDir();

    const watcher = chokidar.watch(this.obsidianDir, {
      persistent: true,
      ignoreInitial: false,
      ignored: [
        /(^|[\/\\])\../,
        "**/Templates/**",
        "**/.trash/**",
        "**/template/**",
        "**/_templates/**",
      ],
      followSymlinks: false, // 맥OS의 심볼릭 링크 처리
    });

    watcher
      .on("add", (filePath: string) => this.handleFile(filePath))
      .on("change", (filePath: string) => this.handleFile(filePath))
      .on("unlink", (filePath: string) => this.handleDelete(filePath)) // 파일 삭제 이벤트 추가
      .on("error", (error: Error) => console.error(`Watcher error: ${error}`))
      .on("ready", () => {
        console.log("Initial scan complete");
        process.exit(0);
      });
  }

  private async scanNextContentDir(): Promise<void> {
    const scanDir = async (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const { data } = matter(content);
          const slug = this.createSlug(data.title);
          this.existingNextPosts.set(slug, fullPath);
        }
      }
    };

    await scanDir(this.nextContentDir);
  }

  private handleDelete(filePath: string): void {
    try {
      // 삭제된 파일이 #devlog 태그를 가진 파일인지 확인
      const nextFilePath = Array.from(this.existingNextPosts.entries()).find(
        ([_, existingPath]) =>
          existingPath.includes(path.basename(filePath, ".md"))
      );

      if (nextFilePath) {
        const [slug, path] = nextFilePath;
        console.log(`Removing deleted post: ${path}`);
        fs.unlinkSync(path);
        this.existingNextPosts.delete(slug);
      }
    } catch (error) {
      console.error(`Error handling delete for ${filePath}:`, error);
    }
  }

  private cleanupOrphanedPosts(): void {
    // 빈 디렉토리 정리만 수행
    const cleanEmptyDirs = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(dir, entry.name);
          cleanEmptyDirs(fullPath);

          // 디렉토리가 비어있으면 삭제
          if (fs.readdirSync(fullPath).length === 0) {
            fs.rmdirSync(fullPath);
            console.log(`Removed empty directory: ${fullPath}`);
          }
        }
      }
    };

    cleanEmptyDirs(this.nextContentDir);
  }

  private formatDate(date: string | Date | undefined): string {
    if (!date) {
      return new Date().toISOString().split("T")[0];
    }

    try {
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      const d = new Date(date);

      if (isNaN(d.getTime())) {
        throw new Error("Invalid date");
      }

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      return new Date().toISOString().split("T")[0];
    }
  }

  private async handleFile(filePath: string): Promise<void> {
    try {
      if (!filePath.endsWith(".md")) return;
      if (filePath.toLowerCase().includes("template")) return;

      const content = fs.readFileSync(filePath, "utf-8");

      if (!content.includes("#devlog")) return;

      // 파일이 이미 처리되었는지 확인
      if (this.processedFiles.has(filePath)) return;

      const updatedContent = content.replace(/#devlog/g, "").trim();

      const { data, content: mdContent } = matter(updatedContent);

      // title만 필수로 체크
      if (!data.title) return;

      const frontMatter = data as FrontMatter;

      let categoryPath = "posts/uncategorized";

      // category는 필요할 때만 사용
      if (frontMatter.category) {
        if (frontMatter.category.includes("/")) {
          const [parentCategory, childCategory] =
            frontMatter.category.split("/");
          categoryPath = path.join(
            "posts",
            parentCategory.toLowerCase(),
            childCategory.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")
          );
        } else {
          categoryPath = path.join(
            "posts",
            frontMatter.category.toLowerCase().replace(/\s+/g, "-")
          );
        }
      }

      const postsDir = path.join(this.nextContentDir, categoryPath);
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }

      let slug: string;
      if (frontMatter.slug) {
        slug = this.createSlug(frontMatter.slug);
      } else {
        const existingSlug = Array.from(this.existingNextPosts.entries()).find(
          ([_, existingPath]) =>
            existingPath ===
            path.join(postsDir, `${this.createSlug(frontMatter.title)}.md`)
        )?.[0];

        slug = existingSlug || this.createSlug(frontMatter.title);
      }

      const stats = fs.statSync(filePath);
      const fileDate = this.formatDate(frontMatter.date || stats.birthtime);

      const tags = this.processTags(frontMatter.tags);
      const [processedContent, firstImageUrl] = this.processImages(mdContent);
      const thumbnail = frontMatter.thumbnail || firstImageUrl || "";

      const destPath = path.join(postsDir, `${slug}.md`);

      // 기존 파일이 있으면 frontmatter 읽어서 views 유지
      let existingViews = 0;
      if (fs.existsSync(destPath)) {
        try {
          const existingContent = fs.readFileSync(destPath, "utf-8");
          const { data: existingData } = matter(existingContent);
          existingViews = existingData.views || 0;
        } catch (error) {
          console.warn(`Failed to read existing views for ${destPath}:`, error);
        }
      }

      const yamlContent = [
        "---",
        `title: "${frontMatter.title}"`,
        `slug: "${slug}"`,
        `date: ${fileDate}`,
        `tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]`,
        frontMatter.category ? `category: "${frontMatter.category}"` : null,
        thumbnail ? `thumbnail: "${thumbnail}"` : null,
        `draft: ${frontMatter.draft || false}`,
        `views: ${existingViews}`,
        "---",
        "",
        processedContent,
      ]
        .filter(Boolean)
        .join("\n");

      const oldPath = this.existingNextPosts.get(slug);
      if (oldPath && oldPath !== destPath) {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log(`Removed old post at: ${oldPath}`);
        }
        this.existingNextPosts.delete(slug);
      }

      fs.writeFileSync(destPath, yamlContent);
      console.log(
        `Processed: ${destPath}${
          existingViews > 0 ? ` (Views preserved: ${existingViews})` : ""
        }`
      );

      // 처리된 파일 추적
      this.processedFiles.add(filePath);
      this.existingNextPosts.set(slug, destPath);
    } catch (error: any) {
      console.error("Error processing file:", filePath);
      console.error("Error:", error.message);
    }
  }

  private processImages(content: string): [string, string] {
    const imagePattern = /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g;
    let updatedContent = content;
    let firstImageUrl: string = "";

    const matches = Array.from(content.matchAll(imagePattern));

    for (const match of matches) {
      const [fullMatch, wikiLink, altText, standardLink] = match;
      let imagePath = wikiLink || standardLink;
      if (!imagePath) continue;

      // 옵시디언 이미지 크기 설정 처리
      let imageWidth = "";
      let processedAltText = altText || "";

      // 1. 위키링크에서 크기 정보 추출 (![[image.png|400]])
      if (wikiLink && wikiLink.includes("|")) {
        const parts = wikiLink.split("|");
        imagePath = parts[0].trim();
        imageWidth = parts[1].trim();
      }

      // 2. 표준 마크다운 alt text에서 크기 정보 추출 (![image|400](url))
      if (altText && altText.includes("|")) {
        const parts = altText.split("|");
        processedAltText = parts[0].trim();
        imageWidth = parts[1].trim();
      }

      // 이미지 URL 처리 (https 이미지의 경우 firstImageUrl 설정)
      if (imagePath.startsWith("https://")) {
        if (!firstImageUrl) firstImageUrl = imagePath;
      }

      // 모든 이미지 처리 (로컬 및 원격)
      const finalAltText =
        processedAltText || imagePath.split("/").pop() || "image";

      if (imageWidth) {
        // 크기가 지정된 경우 HTML img 태그로 변환
        updatedContent = updatedContent.replace(
          fullMatch,
          `<img src="${imagePath}" alt="${finalAltText}" width="${imageWidth}" />`
        );
      } else {
        // 크기가 없는 경우 표준 마크다운으로 변환
        if (wikiLink) {
          updatedContent = updatedContent.replace(
            fullMatch,
            `![${finalAltText}](${imagePath})`
          );
        }
      }
    }

    return [updatedContent, firstImageUrl];
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^가-힣a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private processTags(tags: string | string[] | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;

    return tags
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
}

try {
  const obsidianDir = process.env.OBSIDIAN_DIR;
  const nextContentDir = process.env.NEXT_CONTENT_DIR;

  if (!obsidianDir) throw new Error("OBSIDIAN_DIR is not set in .env.local");
  if (!nextContentDir)
    throw new Error("NEXT_CONTENT_DIR is not set in .env.local");

  const config: BlogSyncConfig = {
    obsidianDir,
    nextContentDir,
  };

  new BlogSync(config);
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
