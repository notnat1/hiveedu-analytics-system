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
Checking out Revision b73525f2a8b2b098eb726ee788e0a7f22d584dae (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b73525f2a8b2b098eb726ee788e0a7f22d584dae # timeout=10
Commit message: "fix: enforce docker project name in Jenkinsfile"
 > git rev-list --no-walk 56a2f28354e7d7abfb2f67a84fdc5cd7b24cfc27 # timeout=10
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
Checking out Revision b73525f2a8b2b098eb726ee788e0a7f22d584dae (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b73525f2a8b2b098eb726ee788e0a7f22d584dae # timeout=10
Commit message: "fix: enforce docker project name in Jenkinsfile"
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
Checking out Revision b73525f2a8b2b098eb726ee788e0a7f22d584dae (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b73525f2a8b2b098eb726ee788e0a7f22d584dae # timeout=10
Commit message: "fix: enforce docker project name in Jenkinsfile"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build Frontend & Backend)
[Pipeline] echo
Building the application images...
[Pipeline] sh
+ docker compose -p hiveedu-analytics build frontend backend proxy
time="2026-08-09T16:52:36Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Image hiveedu-analytics-backend Building 
 Image hiveedu-analytics-frontend Building 
#1 [internal] load local bake definitions
#1 reading from stdin 1.20kB done
#1 DONE 0.0s

#2 [frontend internal] load build definition from Dockerfile
#2 transferring dockerfile: 1.22kB done
#2 DONE 0.2s

#3 [backend internal] load build definition from Dockerfile
#3 transferring dockerfile: 578B done
#3 DONE 0.2s

#4 [backend internal] load metadata for docker.io/library/node:20-alpine
#4 DONE 1.3s

#5 [backend internal] load .dockerignore
#5 transferring context: 2B done
#5 DONE 0.0s

#6 [frontend internal] load .dockerignore
#6 transferring context: 2B done
#6 DONE 0.0s

#7 [backend internal] load build context
#7 DONE 0.0s

#8 [frontend builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#8 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#8 ...

#9 [frontend internal] load build context
#9 DONE 0.0s

#8 [frontend builder 1/6] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#8 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 0.1s done
#8 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 0.1s done
#8 DONE 0.2s

#9 [frontend internal] load build context
#9 transferring context: 2.20MB 0.1s done
#9 DONE 0.1s

#7 [backend internal] load build context
#7 transferring context: 833.16kB 0.1s done
#7 DONE 0.1s

#10 [backend builder 4/6] RUN npm ci
#10 CACHED

#11 [backend production 4/5] COPY --from=builder /app/dist ./dist
#11 CACHED

#12 [backend builder 5/6] COPY . .
#12 CACHED

#13 [backend builder 6/6] RUN npm run build
#13 CACHED

#14 [backend builder 3/6] COPY package*.json ./
#14 CACHED

#15 [backend production 3/5] COPY --from=builder /app/node_modules ./node_modules
#15 CACHED

#16 [backend production 5/5] COPY --from=builder /app/package*.json ./
#16 CACHED

#17 [frontend runner 4/8] RUN mkdir .next
#17 CACHED

#18 [frontend runner 3/8] RUN adduser --system --uid 1001 nextjs
#18 CACHED

#19 [frontend builder 4/4] RUN npm run build
#19 CACHED

#20 [frontend builder 2/6] WORKDIR /app
#20 CACHED

#21 [frontend deps 1/4] RUN apk add --no-cache libc6-compat
#21 CACHED

#22 [frontend deps 4/4] RUN npm ci
#22 CACHED

#23 [frontend builder 3/4] COPY . .
#23 CACHED

#24 [frontend deps 2/4] WORKDIR /app
#24 CACHED

#25 [frontend builder 2/4] COPY --from=deps /app/node_modules ./node_modules
#25 CACHED

#26 [frontend runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#26 CACHED

#27 [frontend deps 3/4] COPY package.json package-lock.json ./
#27 CACHED

#28 [frontend runner 6/8] COPY --from=builder --chown=nextjs:nodejs /app/public ./public
#28 CACHED

#29 [frontend runner 5/8] RUN chown nextjs:nodejs .next
#29 CACHED

#30 [frontend runner 2/8] RUN addgroup --system --gid 1001 nodejs
#30 CACHED

#31 [frontend runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#31 CACHED

#32 [backend] exporting to image
#32 exporting layers
#32 exporting layers done
#32 exporting manifest sha256:8378beb44b37bff81a925765fdf339db15d8c33659ad38f9c14615dcee5144a1 0.0s done
#32 exporting config sha256:e3faa8b32637709aa7000303cf7007289b957665fc18028f583fab0b4baed2cc 0.1s done
#32 exporting attestation manifest sha256:18da1972770c9f263cbee04509cbc11a80e06c083c4af5ace8b2ef9cb2556c75 0.1s done
#32 exporting manifest list sha256:ddc0dc2adf903180c706218a2dda7a598f9550b5d25e886da659ee6d591b38e6
#32 exporting manifest list sha256:ddc0dc2adf903180c706218a2dda7a598f9550b5d25e886da659ee6d591b38e6 0.1s done
#32 naming to docker.io/library/hiveedu-analytics-backend:latest done
#32 unpacking to docker.io/library/hiveedu-analytics-backend:latest 0.0s done
#32 DONE 0.5s

#33 [frontend] exporting to image
#33 exporting layers 0.0s done
#33 exporting manifest sha256:e5f7d58709675d5c428c8fb357158e5a226acdf0ed1621b1f838a1a5b1ffbcb7 0.1s done
#33 exporting config sha256:c13412fc2774c7801a2616d68799a7c2d1fb6bd93fced7dfce5fd9c98719f153 0.0s done
#33 exporting attestation manifest sha256:84bb1744e76009593b9e6ce7e8e4d1d94636d67c8ae39027eac101c20fcbf16d 0.1s done
#33 exporting manifest list sha256:2c91b9fa03c96dd4144792c15abecc465c02d694b2ae18a7cacae70c7fed24e9 0.1s done
#33 naming to docker.io/library/hiveedu-analytics-frontend:latest done
#33 unpacking to docker.io/library/hiveedu-analytics-frontend:latest 0.0s done
#33 DONE 0.5s

#34 [backend] resolving provenance for metadata file
#34 DONE 0.0s

#35 [frontend] resolving provenance for metadata file
#35 DONE 0.0s
 Image hiveedu-analytics-frontend Built 
 Image hiveedu-analytics-backend Built 
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] echo
Deploying the containers...
[Pipeline] sh
+ docker compose -p hiveedu-analytics up -d --remove-orphans
time="2026-08-09T16:52:41Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Container hiveedu-jenkins Running 
 Container hiveedu-db Running 
 Container hiveedu-backend Recreate 
 Container hiveedu-backend Recreated 
 Container hiveedu-frontend Recreate 
 Container hiveedu-frontend Recreated 
 Container hiveedu-nginx Recreate 
 Container hiveedu-nginx Recreated 
 Container hiveedu-backend Starting 
 Container hiveedu-backend Started 
 Container hiveedu-frontend Starting 
 Container hiveedu-frontend Started 
 Container hiveedu-nginx Starting 
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "/var/jenkins_home/workspace/hiveedu-production/nginx/default.conf" to rootfs at "/etc/nginx/conf.d/default.conf": mount src=/var/jenkins_home/workspace/hiveedu-production/nginx/default.conf, dst=/etc/nginx/conf.d/default.conf, dstFd=/proc/thread-self/fd/14, flags=MS_BIND|MS_REC: not a directory: Are you trying to mount a directory onto a file (or vice-versa)? Check if the specified host path exists and is the expected type
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
