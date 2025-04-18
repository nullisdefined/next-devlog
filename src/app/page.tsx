import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, FileText } from "lucide-react";
import {
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiC,
  SiJavascript,
  SiTypescript,
  SiDocker,
  SiAmazon,
  SiGit,
  SiGithub,
  SiMysql,
  SiPostgresql,
  SiMariadb,
  SiReact,
  SiTailwindcss,
  SiNextdotjs,
  SiCplusplus,
  SiVisualstudiocode,
  SiSlack,
  SiTrello,
  SiSwagger,
  SiNotion,
  SiOracle,
  SiSpringboot,
} from "react-icons/si";
import Image from "next/image";

import { FaJava } from "react-icons/fa";

import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";

export default function Home() {
  const skills = [
    {
      category: "Languages",
      techs: [
        { name: "C", icon: <SiC className="h-5 w-5" /> },
        { name: "C++", icon: <SiCplusplus className="h-5 w-5" /> },
        { name: "Java", icon: <FaJava className="h-5 w-5" /> },
        { name: "JavaScript", icon: <SiJavascript className="h-5 w-5" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-5 w-5" /> },
      ],
    },
    {
      category: "Frontend",
      techs: [
        { name: "React", icon: <SiReact className="h-5 w-5" /> },
        { name: "Next.js", icon: <SiNextdotjs className="h-5 w-5" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="h-5 w-5" /> },
      ],
    },
    {
      category: "Backend",
      techs: [
        { name: "Node.js", icon: <SiNodedotjs className="h-5 w-5" /> },
        { name: "Express", icon: <SiExpress className="h-5 w-5" /> },
        { name: "NestJS", icon: <SiNestjs className="h-5 w-5" /> },
        { name: "Spring Boot", icon: <SiSpringboot className="h-5 w-5" /> },
      ],
    },
    {
      category: "Database",
      techs: [
        { name: "MariaDB", icon: <SiMariadb className="h-5 w-5" /> },
        { name: "MySQL", icon: <SiMysql className="h-5 w-5" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-5 w-5" /> },
        { name: "Oracle", icon: <SiOracle className="h-5 w-5" /> },
      ],
    },
    {
      category: "DevOps",
      techs: [
        { name: "Docker", icon: <SiDocker className="h-5 w-5" /> },
        { name: "AWS", icon: <SiAmazon className="h-5 w-5" /> },
        { name: "Git", icon: <SiGit className="h-5 w-5" /> },
        { name: "GitHub", icon: <SiGithub className="h-5 w-5" /> },
      ],
    },
    {
      category: "Tools",
      techs: [
        { name: "VSCode", icon: <SiVisualstudiocode className="h-5 w-5" /> },
        { name: "Swagger", icon: <SiSwagger className="h-5 w-5" /> },
        { name: "Slack", icon: <SiSlack className="h-5 w-5" /> },
        { name: "Notion", icon: <SiNotion className="h-5 w-5" /> },
        { name: "Trello", icon: <SiTrello className="h-5 w-5" /> },
      ],
    },
  ];

  const projects = [
    {
      title: "나날모아",
      description:
        "시니어와 가족 사용자를 대상으로 하는 AI 기반 자동 일정 관리 서비스입니다. 음성 인식, OCR, NLP를 활용하여 편리한 일정 등록을 지원합니다.",
      features: [
        "음성 인식을 통한 자동 일정 등록",
        "이미지 인식(OCR)을 통한 일정 추출",
        "시니어 케어 공유 서비스",
        "카테고리별 일정 관리",
        "가족/간병인과의 일정 공유",
        "자연어 처리를 통한 일정 분석",
      ],
      tech: [
        { name: "TypeScript", icon: <SiTypescript className="h-5 w-5" /> },
        { name: "NestJS", icon: <SiNestjs className="h-5 w-5" /> },
        { name: "Node.js", icon: <SiNodedotjs className="h-5 w-5" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-5 w-5" /> },
      ],
      link: "https://github.com/nanalmoa/nanalmoa",
      image:
        "https://storage.googleapis.com/hotsix-bucket/%EB%82%98%EB%82%A0%EB%AA%A8%EC%95%84.png",
    },
    {
      title: "Travel Manager",
      description:
        "여행 일정과 경비를 효율적으로 관리할 수 있는 서비스입니다. 각 여행지별 일정을 등록하고 경비를 실시간으로 관리할 수 있습니다.",
      features: [
        "여행별 일정 관리",
        "실시간 경비 추적",
        "활동별 상세 기록",
        "여행지별 통화 자동 변환",
        "일정 순서 관리",
        "경비 카테고리 관리",
      ],
      tech: [
        { name: "TypeScript", icon: <SiTypescript className="h-5 w-5" /> },
        { name: "NestJS", icon: <SiNestjs className="h-5 w-5" /> },
        { name: "Node.js", icon: <SiNodedotjs className="h-5 w-5" /> },
        { name: "MySQL", icon: <SiMysql className="h-5 w-5" /> },
      ],
      link: "https://github.com/Programmers-3th-Team-Kim/travel-manager",
      image: "https://storage.googleapis.com/hotsix-bucket/travelmanager.png",
    },
    {
      title: "핫식스 팀 블로그",
      description:
        "팀 단위의 특별한 협업 공간을 제공하는 웹 서비스입니다. 팀원이 작성한 게시글을 쉽게 공유하고 관리할 수 있습니다.",
      features: [
        "팀 단위의 게시글 관리",
        "사용자 인증 및 권한 관리",
        "풍부한 에디터 기능",
        "댓글 및 좋아요 기능",
        "이메일 인증을 통한 비밀번호 변경",
        "공개/비공개 게시글 설정",
      ],
      tech: [
        { name: "TypeScript", icon: <SiTypescript className="h-5 w-5" /> },
        { name: "NestJS", icon: <SiNestjs className="h-5 w-5" /> },
        { name: "Node.js", icon: <SiNodedotjs className="h-5 w-5" /> },
        { name: "MySQL", icon: <SiMysql className="h-5 w-5" /> },
      ],
      link: "https://github.com/nullisdefined/hotsix-teamblog",
      image:
        "https://storage.googleapis.com/hotsix-bucket/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%80.gif",
    },
  ];

  return (
    <>
      {/* 테마 토글 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="min-h-screen bg-background">
        {/* 프로필 섹션 */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              {/* 프로필 이미지 */}
              <div className="w-32 h-32 sm:w-48 sm:h-48 md:ml-8 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <Image
                  src="https://storage.googleapis.com/hotsix-bucket/KakaoTalk_20241022_185833320.jpg"
                  alt="Profile"
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Jaewoo Kim
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                  {/* 한줄 소개 */}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-full">
                  제 손으로 서비스를 개발해 내는 직무에 대한 깊은 희망과, 웹
                  개발이 가지는 가치에 대한 확신으로 개발자를 꿈꾸게 되었습니다.
                  사용자 삶의 질 향상에 있어 변화의 물결을 주도하고, 그 물결의
                  크기 자체를 키우며 다양한 분야에 영향력을 행사하는 웹 개발의
                  무한한 가능성에 동력을 보태고 싶습니다.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button variant="default" asChild>
                    <Link href="/devlog">
                      <FileText className="mr-2 h-4 w-4" />
                      Devlog
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href="https://github.com/nullisdefined"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiGithub className="mr-2 h-4 w-4" />
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="mailto:jaeuu.dev@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 프로젝트 섹션 */}
        <section className="bg-muted py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  {project.image && (
                    <div className="relative w-full h-64">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="mb-4 flex-1">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        주요 기능:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                        {project.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        기술 스택:
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {project.tech.map((tech, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                          >
                            {tech.icon}
                            <span>{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-auto"
                      asChild
                    >
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <SiGithub className="mr-2 h-4 w-4" />
                        repo
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience 섹션 */}
        <section className="bg-muted py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Experience</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Education 카드 */}
              <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Education
                </h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-semibold">숭실대학교</div>
                    <div className="text-muted-foreground text-sm sm:text-base">
                      소프트웨어학부
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      2022.03 ~ 2027.03
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold">그렙(프로그래머스)</div>
                    <div className="text-muted-foreground text-sm sm:text-base">
                      타입스크립트로 함께하는 웹 풀 사이클 개발(React, Node.js)
                      3기
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      2024.04 ~ 2024.10
                    </div>
                  </li>
                </ul>
              </div>

              {/* Certifications 카드 */}
              <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Certifications
                </h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-semibold">정보처리기능사</div>
                    <div className="text-sm sm:text-base text-muted-foreground">
                      한국산업인력공단
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold">네트워크 관리사 2급</div>
                    <div className="text-sm sm:text-base text-muted-foreground">
                      한국정보통신자격협회
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold">SQLD</div>
                    <div className="text-sm sm:text-base text-muted-foreground">
                      한국데이터산업진흥원
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Skills 섹션 */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.category}
                className="p-4 sm:p-6 bg-card rounded-lg shadow-lg"
              >
                <h3 className="font-bold mb-4 text-lg sm:text-xl">
                  {skill.category}
                </h3>
                <ul className="space-y-3">
                  {skill.techs.map((tech) => (
                    <li
                      key={tech.name}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
                    >
                      {tech.icon}
                      <span>{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
