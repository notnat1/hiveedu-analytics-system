deployer@vmi3475565:~$ cd hiveedu-analytics/
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$ ll
total 28
drwxrwxr-x 5 deployer docker   4096 Aug  9 17:19 ./
drwxr-x--- 4 deployer deployer 4096 Aug  9 17:19 ../
drwxrwxr-x 8 deployer docker   4096 Aug  9 17:19 .git/
-rw-rw-r-- 1 deployer docker     66 Aug  9 17:19 .gitattributes
-rw-rw-r-- 1 deployer docker    487 Aug  9 17:19 .gitignore
drwxrwxr-x 2 deployer docker   4096 Aug  9 17:19 backend-api/
drwxrwxr-x 4 deployer docker   4096 Aug  9 17:19 frontend-web/
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$ docker compose
attach   (Attach local standard input, output, and error streams to a service's running container)  publish  (Publish compose application)
bridge   (Convert compose files into another model)                                                 pull     (Pull service images)
build    (Build or rebuild services)                                                                push     (Push service images)
commit   (Create a new image from a service container's changes)                                    restart  (Restart service containers)
config   (Parse, resolve and render compose file in canonical format)                               rm       (Removes stopped service containers)
cp       (Copy files/folders between a service container and the local filesystem)                  run      (Run a one-off command on a service)
create   (Creates containers for a service)                                                         scale    (Scale services)
down     (Stop and remove containers, networks)                                                     start    (Start services)
events   (Receive real time events from containers)                                                 stats    (Display a live stream of container(s) resource usage statistics)
exec     (Execute a command in a running container)                                                 stop     (Stop services)
export   (Export a service container's filesystem as a tar archive)                                 top      (Display the running processes)
images   (List images used by the created containers)                                               unpause  (Unpause services)
kill     (Force stop service containers)                                                            up       (Create and start containers)
logs     (View output from containers)                                                              version  (Show the Docker Compose version information)
ls       (List running compose projects)                                                            volumes  (List volumes)
pause    (Pause services)                                                                           wait     (Block until containers of all (or specified) services stop.)
port     (Print the public port for a port binding)                                                 watch    (Watch build context for service and rebuild/refresh containers when files are updated)
ps       (List containers)
deployer@vmi3475565:~/hiveedu-analytics$ docker compose up -d --build
no configuration file provided: not found
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
