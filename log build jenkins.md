Started by GitHub push by notnat1
Lightweight checkout support not available, falling back to full checkout.
Checking out git https://github.com/notnat1/hiveedu-analytics-system.git into /var/jenkins_home/workspace/hiveedu-production@script/918f28b0f280038bbabf27f78277796bf8d38e30f5293154dcf2c40496ec67b7 to read Jenkinsfile
The recommended git tool is: NONE
No credentials specified
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/hiveedu-production@script/918f28b0f280038bbabf27f78277796bf8d38e30f5293154dcf2c40496ec67b7/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/notnat1/hiveedu-analytics-system.git # timeout=10
Fetching upstream changes from https://github.com/notnat1/hiveedu-analytics-system.git
 > git --version # timeout=10
 > git --version # 'git version 2.47.3'
 > git fetch --tags --force --progress -- https://github.com/notnat1/hiveedu-analytics-system.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/feature/enterprise-upgrade^{commit} # timeout=10
 > git rev-parse feature/enterprise-upgrade^{commit} # timeout=10
Checking out Revision 0d90841c52cbc7272c20cd6e9a2bd46466b58b75 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 0d90841c52cbc7272c20cd6e9a2bd46466b58b75 # timeout=10
Commit message: "feat: tambahkan tombol Draft Intervention dan AI Study Plan"
 > git rev-list --no-walk b61fce8e811473d0508f572cabea9efaa7dc4292 # timeout=10
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/hiveedu-production
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Declarative: Checkout SCM)
[Pipeline] checkout
The recommended git tool is: NONE
No credentials specified
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/hiveedu-production/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/notnat1/hiveedu-analytics-system.git # timeout=10
Fetching upstream changes from https://github.com/notnat1/hiveedu-analytics-system.git
 > git --version # timeout=10
 > git --version # 'git version 2.47.3'
 > git fetch --tags --force --progress -- https://github.com/notnat1/hiveedu-analytics-system.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/feature/enterprise-upgrade^{commit} # timeout=10
 > git rev-parse feature/enterprise-upgrade^{commit} # timeout=10
Checking out Revision 0d90841c52cbc7272c20cd6e9a2bd46466b58b75 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 0d90841c52cbc7272c20cd6e9a2bd46466b58b75 # timeout=10
Commit message: "feat: tambahkan tombol Draft Intervention dan AI Study Plan"
[Pipeline] }
[Pipeline] // stage
[Pipeline] withEnv
[Pipeline] {
[Pipeline] withEnv
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
The recommended git tool is: NONE
No credentials specified
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/hiveedu-production/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/notnat1/hiveedu-analytics-system.git # timeout=10
Fetching upstream changes from https://github.com/notnat1/hiveedu-analytics-system.git
 > git --version # timeout=10
 > git --version # 'git version 2.47.3'
 > git fetch --tags --force --progress -- https://github.com/notnat1/hiveedu-analytics-system.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/feature/enterprise-upgrade^{commit} # timeout=10
 > git rev-parse feature/enterprise-upgrade^{commit} # timeout=10
Checking out Revision 0d90841c52cbc7272c20cd6e9a2bd46466b58b75 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 0d90841c52cbc7272c20cd6e9a2bd46466b58b75 # timeout=10
Commit message: "feat: tambahkan tombol Draft Intervention dan AI Study Plan"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build Frontend & Backend)
[Pipeline] echo
Building the application images...
[Pipeline] sh
+ docker compose -p hiveedu-analytics build frontend backend proxy
time="2026-08-09T17:20:25Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Image hiveedu-analytics-backend Building 
 Image hiveedu-analytics-frontend Building 
 Image hiveedu-analytics-proxy Building 
#1 [internal] load local bake definitions
#1 reading from stdin 1.68kB done
#1 DONE 0.0s

#2 [frontend internal] load build definition from Dockerfile
#2 transferring dockerfile: 1.22kB 0.0s done
#2 DONE 0.0s

#3 [backend internal] load build definition from Dockerfile
#3 transferring dockerfile: 578B done
#3 DONE 0.0s

#4 [proxy internal] load build definition from Dockerfile
#4 transferring dockerfile: 104B done
#4 DONE 0.1s

#5 [proxy internal] load metadata for docker.io/library/nginx:alpine
#5 DONE 0.0s

#6 [backend internal] load metadata for docker.io/library/node:20-alpine
#6 ...

#7 [proxy internal] load .dockerignore
#7 transferring context: 2B done
#7 DONE 0.0s

#8 [proxy internal] load build context
#8 transferring context: 34B done
#8 DONE 0.0s

#9 [proxy 1/2] FROM docker.io/library/nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752
#9 resolve docker.io/library/nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752 0.1s done
#9 DONE 0.1s

#10 [proxy 2/2] COPY default.conf /etc/nginx/conf.d/default.conf
#10 CACHED

#11 [proxy] exporting to image
#11 exporting layers 0.0s done
#11 exporting manifest sha256:1ae37a64abd864ee2d69b7e75f589bcb51a6cf70ea758e3255919df6a42561d0 done
#11 exporting config sha256:fa71888257d9d3d0298acba6ba915068a73c442091d863e8ae84cc776ff29f3a done
#11 exporting attestation manifest sha256:ba8734967903c912b969801d4b9b46afb1e462379107071a1e9dd17a7782fd7b 0.0s done
#11 exporting manifest list sha256:bbeec8fb49ebba25082b63aeb05a22555428a249561bdc9369d4abb7358855bf 0.0s done
#11 naming to docker.io/library/hiveedu-analytics-proxy:latest
#11 naming to docker.io/library/hiveedu-analytics-proxy:latest done
#11 unpacking to docker.io/library/hiveedu-analytics-proxy:latest 0.0s done
#11 DONE 0.3s

#6 [backend internal] load metadata for docker.io/library/node:20-alpine
#6 ...

#12 [proxy] resolving provenance for metadata file
#12 DONE 0.0s

#6 [backend internal] load metadata for docker.io/library/node:20-alpine
#6 DONE 1.5s

#13 [backend internal] load .dockerignore
#13 transferring context: 2B done
#13 DONE 0.0s

#14 [frontend internal] load .dockerignore
#14 transferring context: 2B done
#14 DONE 0.0s

#15 [backend internal] load build context
#15 DONE 0.0s

#16 [frontend builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#16 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#16 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 0.1s done
#16 DONE 0.1s

#17 [frontend internal] load build context
#17 transferring context: 121.91kB 0.0s done
#17 DONE 0.0s

#15 [backend internal] load build context
#15 transferring context: 16.97kB 0.0s done
#15 DONE 0.1s

#18 [frontend deps 2/4] WORKDIR /app
#18 CACHED

#19 [frontend deps 1/4] RUN apk add --no-cache libc6-compat
#19 CACHED

#20 [frontend deps 3/4] COPY package.json package-lock.json ./
#20 CACHED

#21 [frontend deps 4/4] RUN npm ci
#21 CACHED

#22 [backend builder 3/6] COPY package*.json ./
#22 CACHED

#23 [backend builder 2/6] WORKDIR /app
#23 CACHED

#24 [frontend builder 2/4] COPY --from=deps /app/node_modules ./node_modules
#24 CACHED

#25 [backend builder 4/6] RUN npm ci
#25 CACHED

#26 [backend builder 5/6] COPY . .
#26 ...

#27 [frontend builder 3/4] COPY . .
#27 DONE 0.2s

#26 [backend builder 5/6] COPY . .
#26 DONE 0.2s

#28 [backend builder 6/6] RUN npm run build
#28 1.511 
#28 1.511 > backend-api@0.0.1 build
#28 1.511 > nest build
#28 1.511 
#28 ...

#29 [frontend builder 4/4] RUN npm run build
#29 2.787 
#29 2.787 > frontend-web@0.1.0 build
#29 2.787 > next build
#29 2.787 
#29 10.37 ▲ Next.js 16.2.4 (Turbopack)
#29 10.37 
#29 10.49   Creating an optimized production build ...
#29 ...

#28 [backend builder 6/6] RUN npm run build
#28 DONE 27.1s

#29 [frontend builder 4/4] RUN npm run build
#29 35.77 
#29 35.77 > Build error occurred
#29 35.78 Error: Turbopack build failed with 1 errors:
#29 35.78 ./src/app/dashboard/page.tsx:16:1
#29 35.78 A string literal cannot be used as an imported binding.
#29 35.78     - Did you mean `import { "use client" as foo }`?
#29 35.78   [90m14 |[0m   [33mCheckCircle2[0m,
#29 35.78   [90m15 |[0m   [33mAlertCircle[0m,
#29 35.78 [31m[1m>[0m [90m16 |[0m [32m"use client"[0m;
#29 35.78   [90m   |[0m [31m[1m^^^^^^^^^^^^[0m
#29 35.78   [90m17 |[0m
#29 35.78   [90m18 |[0m [36mimport[0m { useEffect, useState, useMemo, useRef } [36mfrom[0m [32m"react"[0m;
#29 35.78   [90m19 |[0m [36mimport[0m { useTranslation } [36mfrom[0m [32m"react-i18next"[0m;
#29 35.78 
#29 35.78 Parsing ecmascript source code failed
#29 35.78 
#29 35.78 
#29 35.78     at <unknown> (./src/app/dashboard/page.tsx:16:1)
#29 36.04 npm notice
#29 36.04 npm notice New major version of npm available! 10.8.2 -> 12.0.2
#29 36.04 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
#29 36.04 npm notice To update run: npm install -g npm@12.0.2
#29 36.04 npm notice
#29 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [frontend builder 4/4] RUN npm run build:
35.78 
35.78 Parsing ecmascript source code failed
35.78 
35.78 
35.78     at <unknown> (./src/app/dashboard/page.tsx:16:1)
36.04 npm notice
36.04 npm notice New major version of npm available! 10.8.2 -> 12.0.2
36.04 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
36.04 npm notice To update run: npm install -g npm@12.0.2
36.04 npm notice
------
Dockerfile:18

--------------------

  16 |     ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

  17 |     ENV NEXT_TELEMETRY_DISABLED=1

  18 | >>> RUN npm run build

  19 |     

  20 |     # Production image, copy all the files and run next

--------------------

target frontend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
Stage "Deploy" skipped due to earlier failure(s)
[Pipeline] getContext
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Verify)
Stage "Verify" skipped due to earlier failure(s)
[Pipeline] getContext
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Declarative: Post Actions)
[Pipeline] echo
Pipeline finished.
[Pipeline] echo
Deployment Failed. Please check the logs.
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
ERROR: script returned exit code 1
Finished: FAILURE
