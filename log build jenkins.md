Started by user Nathan
Lightweight checkout support not available, falling back to full checkout.
Checking out git https://github.com/notnat1/hiveedu-analytics-system.git into /var/jenkins_home/workspace/hiveedu-production@script/918f28b0f280038bbabf27f78277796bf8d38e30f5293154dcf2c40496ec67b7 to read Jenkinsfile
The recommended git tool is: NONE
No credentials specified
Cloning the remote Git repository
Cloning repository https://github.com/notnat1/hiveedu-analytics-system.git
 > git init /var/jenkins_home/workspace/hiveedu-production@script/918f28b0f280038bbabf27f78277796bf8d38e30f5293154dcf2c40496ec67b7 # timeout=10
Fetching upstream changes from https://github.com/notnat1/hiveedu-analytics-system.git
 > git --version # timeout=10
 > git --version # 'git version 2.47.3'
 > git fetch --tags --force --progress -- https://github.com/notnat1/hiveedu-analytics-system.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git config remote.origin.url https://github.com/notnat1/hiveedu-analytics-system.git # timeout=10
 > git config --add remote.origin.fetch +refs/heads/*:refs/remotes/origin/* # timeout=10
Avoid second fetch
 > git rev-parse refs/remotes/origin/feature/enterprise-upgrade^{commit} # timeout=10
 > git rev-parse feature/enterprise-upgrade^{commit} # timeout=10
Checking out Revision 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 # timeout=10
Commit message: "feat: use production domain for api url"
First time build. Skipping changelog.
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/hiveedu-production@2
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Declarative: Checkout SCM)
[Pipeline] checkout
The recommended git tool is: NONE
No credentials specified
Cloning the remote Git repository
Cloning repository https://github.com/notnat1/hiveedu-analytics-system.git
 > git init /var/jenkins_home/workspace/hiveedu-production@2 # timeout=10
Fetching upstream changes from https://github.com/notnat1/hiveedu-analytics-system.git
 > git --version # timeout=10
 > git --version # 'git version 2.47.3'
 > git fetch --tags --force --progress -- https://github.com/notnat1/hiveedu-analytics-system.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git config remote.origin.url https://github.com/notnat1/hiveedu-analytics-system.git # timeout=10
 > git config --add remote.origin.fetch +refs/heads/*:refs/remotes/origin/* # timeout=10
Avoid second fetch
 > git rev-parse refs/remotes/origin/feature/enterprise-upgrade^{commit} # timeout=10
 > git rev-parse feature/enterprise-upgrade^{commit} # timeout=10
Checking out Revision 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 # timeout=10
Commit message: "feat: use production domain for api url"
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
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/hiveedu-production@2/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/notnat1/hiveedu-analytics-system.git # timeout=10
Fetching upstream changes from https://github.com/notnat1/hiveedu-analytics-system.git
 > git --version # timeout=10
 > git --version # 'git version 2.47.3'
 > git fetch --tags --force --progress -- https://github.com/notnat1/hiveedu-analytics-system.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/feature/enterprise-upgrade^{commit} # timeout=10
 > git rev-parse feature/enterprise-upgrade^{commit} # timeout=10
Checking out Revision 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 # timeout=10
Commit message: "feat: use production domain for api url"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build Frontend & Backend)
[Pipeline] echo
Building the application images...
[Pipeline] sh
+ docker compose build frontend backend proxy
time="2026-08-09T16:47:36Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production@2/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Image hiveedu-production2-backend Building 
 Image hiveedu-production2-frontend Building 
#1 [internal] load local bake definitions
#1 reading from stdin 1.21kB done
#1 DONE 0.0s

#2 [frontend internal] load build definition from Dockerfile
#2 transferring dockerfile:
#2 transferring dockerfile: 1.22kB 0.0s done
#2 DONE 0.3s

#3 [backend internal] load build definition from Dockerfile
#3 transferring dockerfile: 578B 0.0s done
#3 DONE 0.3s

#4 [backend internal] load metadata for docker.io/library/node:20-alpine
#4 DONE 2.0s

#5 [backend internal] load .dockerignore
#5 transferring context: 2B done
#5 DONE 0.1s

#6 [frontend internal] load .dockerignore
#6 transferring context: 2B done
#6 DONE 0.1s

#7 [backend builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#7 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 0.0s done
#7 DONE 0.0s

#8 [backend internal] load build context
#8 transferring context: 833.16kB 0.1s done
#8 DONE 0.2s

#9 [frontend builder 2/6] WORKDIR /app
#9 CACHED

#10 [frontend internal] load build context
#10 transferring context: 2.20MB 0.1s done
#10 DONE 0.2s

#11 [frontend deps 1/4] RUN apk add --no-cache libc6-compat
#11 CACHED

#12 [frontend deps 2/4] WORKDIR /app
#12 CACHED

#13 [frontend deps 3/4] COPY package.json package-lock.json ./
#13 ...

#14 [backend builder 3/6] COPY package*.json ./
#14 DONE 0.2s

#13 [frontend deps 3/4] COPY package.json package-lock.json ./
#13 DONE 0.2s

#15 [frontend deps 4/4] RUN npm ci
#15 ...

#16 [backend builder 4/6] RUN npm ci
#16 ...

#15 [frontend deps 4/4] RUN npm ci
#15 11.15 npm warn deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
#15 14.77 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#15 15.23 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#15 ...

#16 [backend builder 4/6] RUN npm ci
#16 12.29 npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
#16 13.57 npm warn deprecated lodash.isequal@4.5.0: This package is deprecated. Use require('node:util').isDeepStrictEqual instead.
#16 14.48 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#16 15.99 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
#16 16.69 npm warn deprecated fstream@1.0.12: This package is no longer supported.
#16 18.12 npm warn deprecated @otplib/plugin-thirty-two@12.0.1: Please upgrade to v13 of otplib. Refer to otplib docs for migration paths
#16 18.31 npm warn deprecated @otplib/plugin-crypto@12.0.1: Please upgrade to v13 of otplib. Refer to otplib docs for migration paths
#16 18.31 npm warn deprecated @otplib/preset-default@12.0.1: Please upgrade to v13 of otplib. Refer to otplib docs for migration paths
#16 20.49 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 21.43 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 22.32 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 23.14 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 25.73 npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 25.86 npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 25.86 npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 25.89 npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
#16 42.48 
#16 42.48 added 983 packages, and audited 984 packages in 42s
#16 42.48 
#16 42.48 170 packages are looking for funding
#16 42.48   run `npm fund` for details
#16 42.55 
#16 42.55 14 vulnerabilities (2 low, 4 moderate, 8 high)
#16 42.55 
#16 42.55 To address issues that do not require attention, run:
#16 42.55   npm audit fix
#16 42.55 
#16 42.55 To address all issues (including breaking changes), run:
#16 42.55   npm audit fix --force
#16 42.55 
#16 42.55 Run `npm audit` for details.
#16 42.55 npm notice
#16 42.55 npm notice New major version of npm available! 10.8.2 -> 12.0.2
#16 42.55 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
#16 42.55 npm notice To update run: npm install -g npm@12.0.2
#16 42.55 npm notice
#16 DONE 45.0s

#15 [frontend deps 4/4] RUN npm ci
#15 ...

#17 [backend builder 5/6] COPY . .
#17 DONE 1.1s

#15 [frontend deps 4/4] RUN npm ci
#15 ...

#18 [backend builder 6/6] RUN npm run build
#18 0.832 
#18 0.832 > backend-api@0.0.1 build
#18 0.832 > nest build
#18 0.832 
#18 ...

#15 [frontend deps 4/4] RUN npm ci
#15 60.77 
#15 60.77 added 866 packages, and audited 867 packages in 60s
#15 60.77 
#15 60.77 256 packages are looking for funding
#15 60.77   run `npm fund` for details
#15 61.23 
#15 61.23 14 vulnerabilities (1 low, 5 moderate, 8 high)
#15 61.23 
#15 61.23 To address issues that do not require attention, run:
#15 61.23   npm audit fix
#15 61.23 
#15 61.23 To address all issues possible (including breaking changes), run:
#15 61.23   npm audit fix --force
#15 61.23 
#15 61.23 Some issues need review, and may require choosing
#15 61.23 a different dependency.
#15 61.23 
#15 61.23 Run `npm audit` for details.
#15 61.23 npm notice
#15 61.23 npm notice New major version of npm available! 10.8.2 -> 12.0.2
#15 61.23 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
#15 61.23 npm notice To update run: npm install -g npm@12.0.2
#15 61.23 npm notice
#15 DONE 62.5s

#18 [backend builder 6/6] RUN npm run build
#18 DONE 17.0s

#19 [frontend builder 2/4] COPY --from=deps /app/node_modules ./node_modules
#19 CACHED

#20 [frontend builder 3/4] COPY . .
#20 DONE 0.1s

#21 [frontend builder 4/4] RUN npm run build
#21 1.359 
#21 1.359 > frontend-web@0.1.0 build
#21 1.359 > next build
#21 1.359 
#21 ...

#22 [backend production 3/5] COPY --from=builder /app/node_modules ./node_modules
#22 CACHED

#23 [backend production 4/5] COPY --from=builder /app/dist ./dist
#23 CACHED

#24 [backend production 5/5] COPY --from=builder /app/package*.json ./
#24 DONE 1.8s

#21 [frontend builder 4/4] RUN npm run build
#21 ...

#25 [backend] exporting to image
#25 exporting layers 0.2s done
#25 exporting manifest sha256:09727abe019fbf248a281293a04148c2f89e66e401cd5763c6d46324334a532e 0.0s done
#25 exporting config sha256:9a7c00bcfdedbf6ad2edc4344834510c6d1f00a5770614fdda07ea5f39e31660 0.0s done
#25 exporting attestation manifest sha256:5e1c5d8e4eea2813ef66494898eded0d12beb352ecd85474a720e69b2275cbbf 0.0s done
#25 exporting manifest list sha256:4313be23e946bea43e70aa5609209f2e331f4ee97ed70e3b85eed864fbc14c02 0.0s done
#25 naming to docker.io/library/hiveedu-production2-backend:latest
#25 naming to docker.io/library/hiveedu-production2-backend:latest done
#25 unpacking to docker.io/library/hiveedu-production2-backend:latest 0.1s done
#25 DONE 0.5s

#21 [frontend builder 4/4] RUN npm run build
#21 ...

#26 [backend] resolving provenance for metadata file
#26 DONE 0.0s

#21 [frontend builder 4/4] RUN npm run build
#21 7.638 ▲ Next.js 16.2.4 (Turbopack)
#21 7.639 
#21 7.710   Creating an optimized production build ...
#21 30.17 ✓ Compiled successfully in 20.1s
#21 30.19   Running TypeScript ...
#21 52.00   Finished TypeScript in 21.8s ...
#21 52.01   Collecting page data using 3 workers ...
#21 53.02   Generating static pages using 3 workers (0/14) ...
#21 54.23   Generating static pages using 3 workers (3/14) 
#21 54.23   Generating static pages using 3 workers (6/14) 
#21 55.11   Generating static pages using 3 workers (10/14) 
#21 55.11 ✓ Generating static pages using 3 workers (14/14) in 2.1s
#21 55.13   Finalizing page optimization ...
#21 55.87 
#21 55.88 Route (app)
#21 55.88 ┌ ○ /
#21 55.88 ├ ○ /_not-found
#21 55.88 ├ ○ /dashboard
#21 55.88 ├ ○ /dashboard/analytics
#21 55.88 ├ ○ /dashboard/attendance
#21 55.88 ├ ○ /dashboard/audit-logs
#21 55.88 ├ ○ /dashboard/history
#21 55.88 ├ ○ /dashboard/records
#21 55.88 ├ ○ /dashboard/settings
#21 55.88 ├ ○ /dashboard/tutors
#21 55.88 ├ ○ /dashboard/users
#21 55.88 ├ ○ /icon.svg
#21 55.88 ├ ○ /login
#21 55.88 └ ƒ /verify/[username]
#21 55.88 
#21 55.88 
#21 55.88 ○  (Static)   prerendered as static content
#21 55.88 ƒ  (Dynamic)  server-rendered on demand
#21 55.88 
#21 56.04 npm notice
#21 56.04 npm notice New major version of npm available! 10.8.2 -> 12.0.2
#21 56.04 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
#21 56.04 npm notice To update run: npm install -g npm@12.0.2
#21 56.04 npm notice
#21 DONE 56.3s

#27 [frontend runner 3/8] RUN adduser --system --uid 1001 nextjs
#27 CACHED

#28 [frontend runner 4/8] RUN mkdir .next
#28 CACHED

#29 [frontend runner 2/8] RUN addgroup --system --gid 1001 nodejs
#29 CACHED

#30 [frontend runner 5/8] RUN chown nextjs:nodejs .next
#30 CACHED

#31 [frontend runner 6/8] COPY --from=builder --chown=nextjs:nodejs /app/public ./public
#31 DONE 0.1s

#32 [frontend runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#32 DONE 0.8s

#33 [frontend runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#33 DONE 0.1s

#34 [frontend] exporting to image
#34 exporting layers
#34 exporting layers 3.8s done
#34 exporting manifest sha256:7823a1d98190048f42ed5ac74165275d353914263f4f0d6baa6cd70d1409f364 0.0s done
#34 exporting config sha256:fc3510333f95666c14b16dcb6b00aa5b3b0e7382dca7dacbe07760f65da1fffe 0.0s done
#34 exporting attestation manifest sha256:704fbdde0a5b6e410ecbe0dd6b512ce5a0b13945e78786220dff6aabab897253 0.0s done
#34 exporting manifest list sha256:f7cf4a6b734f9ac5a03d42e88cca29f26cb43306b2fd2de7c6960f2348015045 0.0s done
#34 naming to docker.io/library/hiveedu-production2-frontend:latest 0.0s done
#34 unpacking to docker.io/library/hiveedu-production2-frontend:latest
#34 unpacking to docker.io/library/hiveedu-production2-frontend:latest 2.1s done
#34 DONE 6.1s

#35 [frontend] resolving provenance for metadata file
#35 DONE 0.0s
 Image hiveedu-production2-frontend Built 
 Image hiveedu-production2-backend Built 
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] echo
Deploying the containers...
[Pipeline] sh
+ docker compose up -d --remove-orphans
time="2026-08-09T16:50:04Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production@2/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Image hiveedu-production2-jenkins Building 
#1 [internal] load local bake definitions
#1 reading from stdin 1.68kB done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 776B done
#2 DONE 0.1s

#3 [internal] load metadata for docker.io/jenkins/jenkins:lts
#3 DONE 1.5s

#4 [internal] load .dockerignore
#4 transferring context: 2B 0.0s done
#4 DONE 0.1s

#5 [1/5] FROM docker.io/jenkins/jenkins:lts@sha256:8547df3b0db2803d158ecc9499207a056bb30c23fddc18bb5b4a4dc14e77dd09
#5 resolve docker.io/jenkins/jenkins:lts@sha256:8547df3b0db2803d158ecc9499207a056bb30c23fddc18bb5b4a4dc14e77dd09 0.1s done
#5 DONE 0.2s

#6 [3/5] RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc     https://download.docker.com/linux/debian/gpg
#6 CACHED

#7 [4/5] RUN echo "deb [arch=$(dpkg --print-architecture)     signed-by=/usr/share/keyrings/docker-archive-keyring.asc]     https://download.docker.com/linux/debian     $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
#7 CACHED

#8 [2/5] RUN apt-get update &&     apt-get install -y lsb-release curl ca-certificates
#8 CACHED

#9 [5/5] RUN apt-get update &&     apt-get install -y docker-ce-cli docker-compose-plugin
#9 CACHED

#10 exporting to image
#10 exporting layers 0.0s done
#10 exporting manifest sha256:21c4480811316cf5090dede27b552179dfa72fa7f3ecf4423e0261412ba8c8a7 0.0s done
#10 exporting config sha256:76531e04fbe769ace29cb515c22b6da5dd1fb80e053b37e87fea33c359524baa 0.1s done
#10 exporting attestation manifest sha256:8dddf4d36b5312cf439bfaabca83c6f80c03e4b782e1c1e742971d4dad9b59d4 0.1s done
#10 exporting manifest list sha256:8a072c13fd9dfe81b1defa3682276a72fd4503b947e1ea175d6bd5a4e1149707 0.1s done
#10 naming to docker.io/library/hiveedu-production2-jenkins:latest
#10 naming to docker.io/library/hiveedu-production2-jenkins:latest 0.0s done
#10 unpacking to docker.io/library/hiveedu-production2-jenkins:latest 0.1s done
#10 DONE 0.8s

#11 resolving provenance for metadata file
#11 DONE 0.0s
 Image hiveedu-production2-jenkins Built 
 Network hiveedu-production2_hiveedu_network Creating 
 Network hiveedu-production2_hiveedu_network Creating 
 Volume hiveedu-production2_db_data Creating 
 Volume hiveedu-production2_db_data Creating 
 Volume hiveedu-production2_jenkins_data Creating 
 Volume hiveedu-production2_jenkins_data Creating 
 Volume hiveedu-production2_db_data Created 
 Volume hiveedu-production2_db_data Created 
 Volume hiveedu-production2_jenkins_data Created 
 Volume hiveedu-production2_jenkins_data Created 
 Network hiveedu-production2_hiveedu_network Created 
 Network hiveedu-production2_hiveedu_network Created 
 Container hiveedu-db Creating 
 Container hiveedu-jenkins Creating 
 service:jenkins:1 Error response from daemon: Conflict. The container name "/hiveedu-jenkins" is already in use by container "4b9c6f54ed83b4f1372a9c9ed4bf1c33b65625616ef9e6c17301f1cadd6dd3db". You have to remove (or rename) that container to be able to reuse that name. 
Error response from daemon: Conflict. The container name "/hiveedu-jenkins" is already in use by container "4b9c6f54ed83b4f1372a9c9ed4bf1c33b65625616ef9e6c17301f1cadd6dd3db". You have to remove (or rename) that container to be able to reuse that name.
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
