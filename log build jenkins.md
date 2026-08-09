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
Checking out Revision b61fce8e811473d0508f572cabea9efaa7dc4292 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b61fce8e811473d0508f572cabea9efaa7dc4292 # timeout=10
Commit message: "fix: build custom nginx image to fix jenkins volume mount error"
 > git rev-list --no-walk b73525f2a8b2b098eb726ee788e0a7f22d584dae # timeout=10
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
Checking out Revision b61fce8e811473d0508f572cabea9efaa7dc4292 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b61fce8e811473d0508f572cabea9efaa7dc4292 # timeout=10
Commit message: "fix: build custom nginx image to fix jenkins volume mount error"
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
Checking out Revision b61fce8e811473d0508f572cabea9efaa7dc4292 (refs/remotes/origin/feature/enterprise-upgrade)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b61fce8e811473d0508f572cabea9efaa7dc4292 # timeout=10
Commit message: "fix: build custom nginx image to fix jenkins volume mount error"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build Frontend & Backend)
[Pipeline] echo
Building the application images...
[Pipeline] sh
+ docker compose -p hiveedu-analytics build frontend backend proxy
time="2026-08-09T16:54:28Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Image hiveedu-analytics-proxy Building 
 Image hiveedu-analytics-backend Building 
 Image hiveedu-analytics-frontend Building 
#1 [internal] load local bake definitions
#1 reading from stdin 1.68kB done
#1 DONE 0.0s

#2 [backend internal] load build definition from Dockerfile
#2 transferring dockerfile: 578B done
#2 DONE 0.0s

#3 [frontend internal] load build definition from Dockerfile
#3 transferring dockerfile: 1.22kB done
#3 DONE 0.0s

#4 [proxy internal] load build definition from Dockerfile
#4 transferring dockerfile: 104B done
#4 DONE 0.1s

#5 [proxy internal] load metadata for docker.io/library/nginx:alpine
#5 DONE 0.0s

#6 [frontend internal] load metadata for docker.io/library/node:20-alpine
#6 ...

#7 [proxy internal] load .dockerignore
#7 transferring context: 2B done
#7 DONE 0.0s

#8 [proxy internal] load build context
#8 transferring context: 994B done
#8 DONE 0.1s

#9 [proxy 1/2] FROM docker.io/library/nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752
#9 resolve docker.io/library/nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752 0.1s done
#9 DONE 0.3s

#6 [frontend internal] load metadata for docker.io/library/node:20-alpine
#6 ...

#10 [proxy 2/2] COPY default.conf /etc/nginx/conf.d/default.conf
#10 DONE 0.0s

#11 [proxy] exporting to image
#11 exporting layers 0.2s done
#11 exporting manifest sha256:1ae37a64abd864ee2d69b7e75f589bcb51a6cf70ea758e3255919df6a42561d0 0.0s done
#11 exporting config sha256:fa71888257d9d3d0298acba6ba915068a73c442091d863e8ae84cc776ff29f3a 0.0s done
#11 exporting attestation manifest sha256:57d5dea9f795a6ad84977c8f658aa9d73fa006dcb5afc77769a7acfa7f0d6d28 0.0s done
#11 exporting manifest list sha256:bc06cabc48ed036977339352f69853cd3b210ff7fcd7ed70a55455c7cc2d1032 0.0s done
#11 naming to docker.io/library/hiveedu-analytics-proxy:latest
#11 ...

#6 [frontend internal] load metadata for docker.io/library/node:20-alpine
#6 DONE 0.9s

#12 [frontend internal] load .dockerignore
#12 transferring context: 2B done
#12 DONE 0.0s

#13 [backend internal] load .dockerignore
#13 transferring context: 2B done
#13 DONE 0.0s

#14 [frontend internal] load build context
#14 DONE 0.0s

#15 [backend internal] load build context
#15 DONE 0.0s

#11 [proxy] exporting to image
#11 naming to docker.io/library/hiveedu-analytics-proxy:latest done
#11 unpacking to docker.io/library/hiveedu-analytics-proxy:latest 0.1s done
#11 DONE 0.5s

#16 [frontend base 1/1] FROM docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293
#16 resolve docker.io/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 0.1s done
#16 DONE 0.1s

#14 [frontend internal] load build context
#14 transferring context: 3.35kB 0.0s done
#14 DONE 0.0s

#15 [backend internal] load build context
#15 transferring context: 5.48kB 0.0s done
#15 DONE 0.0s

#17 [frontend deps 1/4] RUN apk add --no-cache libc6-compat
#17 CACHED

#18 [frontend builder 3/4] COPY . .
#18 CACHED

#19 [frontend runner 3/8] RUN adduser --system --uid 1001 nextjs
#19 CACHED

#20 [frontend runner 2/8] RUN addgroup --system --gid 1001 nodejs
#20 CACHED

#21 [frontend deps 4/4] RUN npm ci
#21 CACHED

#22 [frontend deps 2/4] WORKDIR /app
#22 CACHED

#23 [frontend runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#23 CACHED

#24 [frontend runner 6/8] COPY --from=builder --chown=nextjs:nodejs /app/public ./public
#24 CACHED

#25 [frontend deps 3/4] COPY package.json package-lock.json ./
#25 CACHED

#26 [frontend builder 4/4] RUN npm run build
#26 CACHED

#27 [frontend runner 4/8] RUN mkdir .next
#27 CACHED

#28 [frontend builder 2/4] COPY --from=deps /app/node_modules ./node_modules
#28 CACHED

#29 [frontend runner 5/8] RUN chown nextjs:nodejs .next
#29 CACHED

#30 [backend builder 6/6] RUN npm run build
#30 CACHED

#31 [backend builder 4/6] RUN npm ci
#31 CACHED

#32 [backend production 4/5] COPY --from=builder /app/dist ./dist
#32 CACHED

#33 [backend production 3/5] COPY --from=builder /app/node_modules ./node_modules
#33 CACHED

#34 [backend builder 5/6] COPY . .
#34 CACHED

#35 [backend builder 1/4] WORKDIR /app
#35 CACHED

#36 [backend builder 3/6] COPY package*.json ./
#36 CACHED

#37 [backend production 5/5] COPY --from=builder /app/package*.json ./
#37 CACHED

#38 [frontend runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#38 CACHED

#39 [backend] exporting to image
#39 exporting layers 0.0s done
#39 exporting manifest sha256:8378beb44b37bff81a925765fdf339db15d8c33659ad38f9c14615dcee5144a1 done
#39 exporting config sha256:e3faa8b32637709aa7000303cf7007289b957665fc18028f583fab0b4baed2cc done
#39 exporting attestation manifest sha256:87eeadb367b3d984ddf1d49c85f2f644535a51c646d40173964bf4bcd19a75b9 0.1s done
#39 exporting manifest list sha256:05b036be76eeda71e3419803b295a32a761d97c2920486deac4b4b683ba22a08
#39 exporting manifest list sha256:05b036be76eeda71e3419803b295a32a761d97c2920486deac4b4b683ba22a08 0.0s done
#39 naming to docker.io/library/hiveedu-analytics-backend:latest 0.0s done
#39 unpacking to docker.io/library/hiveedu-analytics-backend:latest 0.0s done
#39 DONE 0.3s

#40 [proxy] resolving provenance for metadata file
#40 DONE 0.0s

#41 [frontend] exporting to image
#41 exporting layers 0.0s done
#41 exporting manifest sha256:e5f7d58709675d5c428c8fb357158e5a226acdf0ed1621b1f838a1a5b1ffbcb7 done
#41 exporting config sha256:c13412fc2774c7801a2616d68799a7c2d1fb6bd93fced7dfce5fd9c98719f153 done
#41 exporting attestation manifest sha256:ac03b312504926ce600a4f921af04027c5af3e1c7a70e062a9fd8870d83854ea 0.1s done
#41 exporting manifest list sha256:b0cdf4ec7633c0373cd548fa3af0d1f595f4aa08b5f252b67bc183b46620ad44 0.0s done
#41 naming to docker.io/library/hiveedu-analytics-frontend:latest done
#41 unpacking to docker.io/library/hiveedu-analytics-frontend:latest 0.0s done
#41 DONE 0.3s

#42 [backend] resolving provenance for metadata file
#42 DONE 0.1s

#43 [frontend] resolving provenance for metadata file
#43 DONE 0.0s
 Image hiveedu-analytics-frontend Built 
 Image hiveedu-analytics-backend Built 
 Image hiveedu-analytics-proxy Built 
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] echo
Deploying the containers...
[Pipeline] sh
+ docker compose -p hiveedu-analytics up -d --remove-orphans
time="2026-08-09T16:54:30Z" level=warning msg="/var/jenkins_home/workspace/hiveedu-production/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
 Container hiveedu-frontend Running 
 Container hiveedu-jenkins Running 
 Container hiveedu-db Running 
 Container hiveedu-backend Running 
 Container hiveedu-nginx Recreate 
 Container hiveedu-nginx Recreated 
 Container hiveedu-nginx Starting 
 Container hiveedu-nginx Started 
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Verify)
[Pipeline] echo
Verifying running containers...
[Pipeline] sh
+ docker compose -p hiveedu-analytics ps
NAME               IMAGE                                                                     COMMAND                  SERVICE    CREATED              STATUS                  PORTS
hiveedu-backend    sha256:ddc0dc2adf903180c706218a2dda7a598f9550b5d25e886da659ee6d591b38e6   "docker-entrypoint.s…"   backend    About a minute ago   Up About a minute       0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
hiveedu-db         postgres:15-alpine                                                        "docker-entrypoint.s…"   db         About an hour ago    Up About an hour        0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
hiveedu-frontend   sha256:2c91b9fa03c96dd4144792c15abecc465c02d694b2ae18a7cacae70c7fed24e9   "docker-entrypoint.s…"   frontend   About a minute ago   Up About a minute       0.0.0.0:3001->3000/tcp, [::]:3001->3000/tcp
hiveedu-jenkins    hiveedu-analytics-jenkins                                                 "/usr/bin/tini -- /u…"   jenkins    About an hour ago    Up About an hour        0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp, 0.0.0.0:50000->50000/tcp, [::]:50000->50000/tcp
hiveedu-nginx      hiveedu-analytics-proxy                                                   "/docker-entrypoint.…"   proxy      1 second ago         Up Less than a second   0.0.0.0:80->80/tcp, [::]:80->80/tcp
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Declarative: Post Actions)
[Pipeline] echo
Pipeline finished.
[Pipeline] echo
Deployment to Production Successful!
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
