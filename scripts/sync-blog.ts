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
      .on("error", (error: Error) => console.error(`Watcher error: ${error}`))
      .on("ready", () => {
        this.cleanupOrphanedPosts();
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

  private cleanupOrphanedPosts(): void {
    console.log("Cleaning up orphaned posts...");
    this.existingNextPosts.forEach((filePath, slug) => {
      if (fs.existsSync(filePath)) {
        console.log(`Removing orphaned post: ${filePath}`);
        fs.unlinkSync(filePath);

        let dir = path.dirname(filePath);
        while (dir !== this.nextContentDir) {
          if (fs.readdirSync(dir).length === 0) {
            fs.rmdirSync(dir);
            dir = path.dirname(dir);
          } else {
            break;
          }
        }
      }
    });
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

      const yamlContent = [
        "---",
        `title: "${frontMatter.title}"`,
        `slug: "${slug}"`,
        `date: ${fileDate}`,
        `tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]`,
        frontMatter.category ? `category: "${frontMatter.category}"` : null,
        thumbnail ? `thumbnail: "${thumbnail}"` : null,
        `draft: ${frontMatter.draft || false}`,
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
      console.log(`Processed: ${destPath}`);

      this.existingNextPosts.delete(slug);
      this.processedFiles.add(filePath);
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
      const imagePath = wikiLink || standardLink;
      if (!imagePath) continue;

      if (imagePath.startsWith("https://")) {
        if (!firstImageUrl) firstImageUrl = imagePath;
        if (wikiLink) {
          updatedContent = updatedContent.replace(
            fullMatch,
            `![${wikiLink}](${imagePath})`
          );
        }
        continue;
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
