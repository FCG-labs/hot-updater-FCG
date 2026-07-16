import { getCwd } from "@hot-updater/cli-tools";
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Commit class compatible with es-git's Commit interface
 */
class Commit {
  constructor(
    private readonly commitHash: string,
    private readonly commitMessage: string | null,
  ) {}

  id(): string {
    return this.commitHash;
  }

  summary(): string | null {
    return this.commitMessage;
  }
}

export const getLatestGitCommit = async (): Promise<Commit | null> => {
  try {
    const cwd = getCwd();

    // Get commit hash
    const { stdout: hash } = await execAsync("git rev-parse HEAD", { cwd });
    const commitHash = hash.trim();

    if (!commitHash) {
      return null;
    }

    // Get commit message (first line only)
    const { stdout: message } = await execAsync("git log -1 --format=%s", {
      cwd,
    });
    const commitMessage = message.trim() || null;

    return new Commit(commitHash, commitMessage);
  } catch {
    return null;
  }
};

export interface UploaderIdentity {
  uploader: string;
  gitBranch: string | null;
}

/**
 * 번들 메타데이터용 업로더 식별 정보.
 *
 * 릴리즈 스크립트가 detached worktree에서 deploy를 실행하면 브랜치명이 "HEAD"로
 * 뭉개지므로, 호출측이 원 브랜치를 아는 경우 환경변수(HOT_UPDATER_GIT_BRANCH,
 * HOT_UPDATER_UPLOADER)로 주입할 수 있게 오버라이드를 우선한다.
 */
export const getUploaderIdentity = async (): Promise<UploaderIdentity> => {
  const cwd = getCwd();

  let gitUserName: string | null = null;
  try {
    const { stdout } = await execAsync("git config user.name", { cwd });
    gitUserName = stdout.trim() || null;
  } catch {
    gitUserName = null;
  }

  let gitBranch: string | null = null;
  try {
    const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD", {
      cwd,
    });
    const branch = stdout.trim();
    gitBranch = branch && branch !== "HEAD" ? branch : null;
  } catch {
    gitBranch = null;
  }

  const fallbackUploader = `${os.userInfo().username}@${os.hostname()}`;

  return {
    uploader:
      process.env["HOT_UPDATER_UPLOADER"] || gitUserName || fallbackUploader,
    gitBranch: process.env["HOT_UPDATER_GIT_BRANCH"] || gitBranch,
  };
};

/**
 * append globLines into project's .gitignore
 *
 * @returns whether .gitignore was changed
 */
export const appendToProjectRootGitignore = ({
  cwd,
  globLines,
}: {
  cwd?: string;
  globLines: string[];
}): boolean => {
  if (!globLines.length) {
    return false;
  }
  const comment = "# hot-updater";

  const projectDir = cwd ?? getCwd();
  const gitIgnorePath = path.join(projectDir, ".gitignore");

  if (fs.existsSync(gitIgnorePath)) {
    const content = fs.readFileSync(gitIgnorePath, { encoding: "utf8" });

    const allLines = content.split(/\r?\n/);
    const willAppendedLines: string[] = [];
    for (const line of globLines) {
      if (!allLines.find((l) => l.trim() === line)) {
        willAppendedLines.push(line);
      }
    }

    if (!willAppendedLines.length) {
      return false;
    }

    // Ensure there's a newline before appending if the file doesn't end with one
    const needsNewlineBefore = content.length > 0 && !content.endsWith("\n");
    const textToAppend = [comment, ...willAppendedLines].join("\n");

    fs.appendFileSync(
      gitIgnorePath,
      `${needsNewlineBefore ? "\n" : ""}${textToAppend}\n`,
      {
        encoding: "utf8",
      },
    );
  } else {
    fs.writeFileSync(gitIgnorePath, `${[comment, ...globLines].join("\n")}\n`, {
      encoding: "utf8",
    });
  }
  return true;
};
