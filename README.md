# GitHub Pages 배포

게임은 dist 폴더의 정적 파일로 실행됩니다. ChatGPT 로그인과 AI API 키가 필요 없습니다. Python 분석 도구는 처음 실행할 때 CDN에서 다운로드합니다.

1. GitHub에 공개 저장소 `prompt-quest`를 만듭니다.
2. 업로드용 ZIP을 풀고 `.github` 폴더, `dist` 폴더, README.md를 저장소 루트에 올립니다. ZIP 파일 자체를 올리지 마세요.
3. 저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 설정합니다.
4. Actions → Publish game to GitHub Pages → Run workflow를 실행합니다.
5. 성공한 실행의 github-pages 주소에서 게임을 엽니다.

이후 main 브랜치에 파일 변경을 반영하면 자동 배포됩니다. dist를 그대로 유지해야 하며, .github/workflows/pages.yml은 dist 밖에 있어야 합니다.

기존 Sites의 .git 이력, .openai 설정 및 로컬 테스트 의존성은 배포 패키지에 포함하지 않습니다. 기존 Sites 주소의 기록과 새 GitHub Pages 주소의 브라우저 저장 기록은 서로 공유되지 않습니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
