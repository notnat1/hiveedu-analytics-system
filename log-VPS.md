deployer@vmi3475565:~/hiveedu-analytics$ sudo systemctl enable --now docker
Synchronizing state of docker.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable docker
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$ sudo systemctl status docker
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Sun 2026-08-09 17:31:41 CEST; 16s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 229560 (dockerd)
      Tasks: 10
     Memory: 122.3M (peak: 123.0M)
        CPU: 2.346s
     CGroup: /system.slice/docker.service
             └─229560 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

Aug 09 17:31:39 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:39.937102066+02:00" level=info msg="Restoring containers: start."
Aug 09 17:31:40 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:40.074066642+02:00" level=info msg="Deleting nftables IPv4 rules" error="running nft: /dev/stdin:1:17-30: Error: Could not process rule: No such file >
Aug 09 17:31:40 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:40.095143284+02:00" level=info msg="Deleting nftables IPv6 rules" error="running nft: /dev/stdin:1:18-31: Error: Could not process rule: No such file >
Aug 09 17:31:41 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:41.050950879+02:00" level=info msg="Loading containers: done."
Aug 09 17:31:41 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:41.089375031+02:00" level=info msg="Docker daemon" commit=6a43e3d containerd-snapshotter=true storage-driver=overlayfs version=29.7.2
Aug 09 17:31:41 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:41.089531564+02:00" level=info msg="Initializing buildkit"
Aug 09 17:31:41 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:41.306389311+02:00" level=info msg="Completed buildkit initialization"
Aug 09 17:31:41 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:41.328840391+02:00" level=info msg="Daemon has completed initialization"
Aug 09 17:31:41 vmi3475565 dockerd[229560]: time="2026-08-09T17:31:41.329812034+02:00" level=info msg="API listen on /run/docker.sock"
Aug 09 17:31:41 vmi3475565 systemd[1]: Started docker.service - Docker Application Container Engine.

deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$ sudo docker compose up -d --build
WARN[0000] /home/deployer/hiveedu-analytics/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
[+] up 23/24
 ✔ Image nginx:alpine       Pulled                                                                                                                                                                                   10.3s
 ✔ Image postgres:15-alpine Pulled                                                                                                                                                                                   19.1s
[+] Building 133.9s (39/42)
 => [internal] load local bake definitions                                                                                                                                                                           0.0s
 => => reading from stdin 1.52kB                                                                                                                                                                                     0.0s
 => [jenkins internal] load build definition from Dockerfile                                                                                                                                                         0.1s
 => => transferring dockerfile: 776B                                                                                                                                                                                 0.0s
 => [backend internal] load build definition from Dockerfile                                                                                                                                                         0.1s
 => => transferring dockerfile: 592B                                                                                                                                                                                 0.0s
 => [frontend internal] load build definition from Dockerfile                                                                                                                                                        0.1s
 => => transferring dockerfile: 1.15kB                                                                                                                                                                               0.0s
 => [jenkins internal] load metadata for docker.io/jenkins/jenkins:lts                                                                                                                                               2.3s
 => [backend internal] load metadata for docker.io/library/node:18-alpine                                                                                                                                            2.3s
 => [jenkins internal] load .dockerignore                                                                                                                                                                            0.1s
 => => transferring context: 2B                                                                                                                                                                                      0.0s
 => [frontend internal] load .dockerignore                                                                                                                                                                           0.1s
 => => transferring context: 2B                                                                                                                                                                                      0.0s
 => [backend internal] load .dockerignore                                                                                                                                                                            0.1s
 => => transferring context: 2B                                                                                                                                                                                      0.0s
 => [frontend builder 1/6] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e                                                                             8.5s
 => => resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e                                                                                              0.1s
 => => sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549 446B / 446B                                                                                                                           0.3s
 => => sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3 1.26MB / 1.26MB                                                                                                                       0.6s
 => => sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 40.01MB / 40.01MB                                                                                                                     3.5s
 => => sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870 3.64MB / 3.64MB                                                                                                                       1.3s
 => => extracting sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870                                                                                                                            0.3s
 => => extracting sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e                                                                                                                            4.3s
 => => extracting sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3                                                                                                                            0.2s
 => => extracting sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549                                                                                                                            0.0s
 => [frontend internal] load build context                                                                                                                                                                           0.3s
 => => transferring context: 2.20MB                                                                                                                                                                                  0.1s
 => [backend internal] load build context                                                                                                                                                                            0.3s
 => => transferring context: 833.12kB                                                                                                                                                                                0.1s
 => [jenkins 1/5] FROM docker.io/jenkins/jenkins:lts@sha256:8547df3b0db2803d158ecc9499207a056bb30c23fddc18bb5b4a4dc14e77dd09                                                                                        38.6s
 => => resolve docker.io/jenkins/jenkins:lts@sha256:8547df3b0db2803d158ecc9499207a056bb30c23fddc18bb5b4a4dc14e77dd09                                                                                                 0.1s
 => => sha256:adea3ef8b4db3e85e81608a94ff829a46d51669a65671056c1752bd8b8da8232 391B / 391B                                                                                                                           0.3s
 => => sha256:18e2bde91fb067df55af69149ac5e3edaf075d403d079d1b471fad9ac8b4fe62 1.29kB / 1.29kB                                                                                                                       0.3s
 => => sha256:a5e3afd1e0b3cf2f1b5d1230490decd35079d8e941c321618ed2efef69ba9bfd 2.65kB / 2.65kB                                                                                                                       0.6s
 => => sha256:ae71a7561ea537a28198d728269b680eda28ec3bb9fa45ec2583730670554f66 100.98MB / 100.98MB                                                                                                                  12.1s
 => => sha256:8957c4df8f9d89bcbe692b371fe0add0af6f617d75267a0589ec43bdaa94be79 6.45MB / 6.45MB                                                                                                                       2.1s
 => => sha256:f19a623914320692b9eb745387631946e7f30fb87f577b2d2a5d25b4d02ea044 72.24MB / 72.24MB                                                                                                                    13.3s
 => => sha256:844d30ade61d27e39771ded7f6e50a42d294ac1b6c467e6caf9920a3ae2f44b1 188B / 188B                                                                                                                           0.3s
 => => sha256:add9a913292e0ee6b6256120462f6013e47cfc83ca38fe62c910e31ef8903916 182B / 182B                                                                                                                           0.3s
 => => sha256:01f97d1e583fbbd652ca4ab0b94b888be23dc84099735684e9095dbea4cc136a 1.23kB / 1.23kB                                                                                                                       0.3s
 => => sha256:d8ae5f65d97ef1b391bb3099597b31795f93d772af2d2be7fad21a649bc1fb2e 5.24MB / 5.24MB                                                                                                                       4.3s
 => => sha256:a52ea482db5702afb15f638193ca97b9407c96114089cf0a0205a69f32e571a7 55.63MB / 55.63MB                                                                                                                     3.9s
 => => sha256:b890c9407285c31d25426ef154b55c72e225f19b478a59451b01a8a44f5ea4f7 49.31MB / 49.31MB                                                                                                                     7.4s
 => => extracting sha256:b890c9407285c31d25426ef154b55c72e225f19b478a59451b01a8a44f5ea4f7                                                                                                                            4.7s
 => => extracting sha256:a52ea482db5702afb15f638193ca97b9407c96114089cf0a0205a69f32e571a7                                                                                                                            7.7s
 => => extracting sha256:d8ae5f65d97ef1b391bb3099597b31795f93d772af2d2be7fad21a649bc1fb2e                                                                                                                            0.9s
 => => extracting sha256:01f97d1e583fbbd652ca4ab0b94b888be23dc84099735684e9095dbea4cc136a                                                                                                                            0.1s
 => => extracting sha256:add9a913292e0ee6b6256120462f6013e47cfc83ca38fe62c910e31ef8903916                                                                                                                            0.1s
 => => extracting sha256:844d30ade61d27e39771ded7f6e50a42d294ac1b6c467e6caf9920a3ae2f44b1                                                                                                                            0.0s
 => => extracting sha256:8957c4df8f9d89bcbe692b371fe0add0af6f617d75267a0589ec43bdaa94be79                                                                                                                            0.3s
 => => extracting sha256:f19a623914320692b9eb745387631946e7f30fb87f577b2d2a5d25b4d02ea044                                                                                                                            5.1s
 => => extracting sha256:ae71a7561ea537a28198d728269b680eda28ec3bb9fa45ec2583730670554f66                                                                                                                            3.5s
 => => extracting sha256:a5e3afd1e0b3cf2f1b5d1230490decd35079d8e941c321618ed2efef69ba9bfd                                                                                                                            0.1s
 => => extracting sha256:18e2bde91fb067df55af69149ac5e3edaf075d403d079d1b471fad9ac8b4fe62                                                                                                                            0.1s
 => => extracting sha256:adea3ef8b4db3e85e81608a94ff829a46d51669a65671056c1752bd8b8da8232                                                                                                                            0.2s
 => [backend builder 2/6] WORKDIR /app                                                                                                                                                                               1.0s
 => [frontend deps 1/4] RUN apk add --no-cache libc6-compat                                                                                                                                                          6.7s
 => [backend builder 3/6] COPY package*.json ./                                                                                                                                                                      0.6s
 => [frontend runner 2/8] RUN addgroup --system --gid 1001 nodejs                                                                                                                                                    1.5s
 => [backend builder 4/6] RUN npm ci                                                                                                                                                                                59.5s
 => [frontend runner 3/8] RUN adduser --system --uid 1001 nextjs                                                                                                                                                     0.6s
 => [frontend runner 4/8] RUN mkdir .next                                                                                                                                                                            0.6s
 => [frontend runner 5/8] RUN chown nextjs:nodejs .next                                                                                                                                                              0.6s
 => [frontend deps 2/4] WORKDIR /app                                                                                                                                                                                 0.2s
 => [frontend deps 3/4] COPY package.json package-lock.json ./                                                                                                                                                       0.2s
 => [frontend deps 4/4] RUN npm ci                                                                                                                                                                                  85.2s
 => [jenkins 2/5] RUN apt-get update &&     apt-get install -y lsb-release curl ca-certificates                                                                                                                     14.2s
 => [jenkins 3/5] RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc     https://download.docker.com/linux/debian/gpg                                                                                    1.2s
 => [jenkins 4/5] RUN echo "deb [arch=$(dpkg --print-architecture)     signed-by=/usr/share/keyrings/docker-archive-keyring.asc]     https://download.docker.com/linux/debian     $(lsb_release -cs) stable" > /etc  0.8s
 => [jenkins 5/5] RUN apt-get update &&     apt-get install -y docker-ce-cli docker-compose-plugin                                                                                                                  14.8s
 => [backend builder 5/6] COPY . .                                                                                                                                                                                   1.3s
 => [jenkins] exporting to image                                                                                                                                                                                    19.2s
 => => exporting layers                                                                                                                                                                                             13.6s
 => => exporting manifest sha256:9805cbdbced4283cfa24e7d9ad9fc63f1005b18281ec194791dac24ca741147a                                                                                                                    0.0s
 => => exporting config sha256:00cb2de1ebe9c2faec7b487583183851e66d84487f4c1b4bdb82eea67c0c0100                                                                                                                      0.1s
 => => exporting attestation manifest sha256:120d4411db75591c8adad7a32ea1192dfe0b5991125bf817a3333182eb8a6000                                                                                                        0.1s
 => => exporting manifest list sha256:fd1cdedb64412eba9a87f75405e1035566f5b90808d2e584f3c3b46c5bc89371                                                                                                               0.0s
 => => naming to docker.io/library/hiveedu-analytics-jenkins:latest                                                                                                                                                  0.0s
 => => unpacking to docker.io/library/hiveedu-analytics-jenkins:latest                                                                                                                                               5.2s
 => [backend builder 6/6] RUN npm run build                                                                                                                                                                         22.4s
 => [jenkins] resolving provenance for metadata file                                                                                                                                                                 0.1s
 => [backend production 3/5] COPY --from=builder /app/node_modules ./node_modules                                                                                                                                   14.9s
 => [frontend builder 2/4] COPY --from=deps /app/node_modules ./node_modules                                                                                                                                        18.3s
 => [backend production 4/5] COPY --from=builder /app/dist ./dist                                                                                                                                                    1.4s
 => [backend production 5/5] COPY --from=builder /app/package*.json ./                                                                                                                                               1.6s
 => CANCELED [backend] exporting to image                                                                                                                                                                           11.7s
 => => exporting layers                                                                                                                                                                                             11.7s
 => [frontend builder 3/4] COPY . .                                                                                                                                                                                  0.8s
 => ERROR [frontend builder 4/4] RUN npm run build                                                                                                                                                                   2.0s
------
 > [frontend builder 4/4] RUN npm run build:
1.507
1.507 > frontend-web@0.1.0 build
1.507 > next build
1.507
1.870 You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.
1.901 npm notice
1.901 npm notice New major version of npm available! 10.8.2 -> 12.0.2
1.901 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
[+] up 23/27tice To update run: npm install -g npm@12.0.2
 ✔ Image nginx:alpine               Pulled                                                                                                                                                                           10.3s
 ✔ Image postgres:15-alpine         Pulled                                                                                                                                                                           19.1s
 ⠙ Image hiveedu-analytics-jenkins  Building                                                                                                                                                                        134.1s
 ⠙ Image hiveedu-analytics-backend  Building                                                                                                                                                                        134.1s
 ⠙ Image hiveedu-analytics-frontend Building                                                                                                                                                                        134.1s
Dockerfile:16

--------------------

  14 |     COPY . .

  15 |     ENV NEXT_TELEMETRY_DISABLED=1

  16 | >>> RUN npm run build

  17 |

  18 |     # Production image, copy all the files and run next

--------------------

target frontend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
