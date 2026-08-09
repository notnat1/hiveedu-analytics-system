deployer@vmi3475565:~/hiveedu-analytics$ docker compose ps
WARN[0000] /home/deployer/hiveedu-analytics/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
NAME               IMAGE                        COMMAND                  SERVICE    CREATED              STATUS                          PORTS
hiveedu-backend    hiveedu-analytics-backend    "docker-entrypoint.s…"   backend    About a minute ago   Restarting (1) 17 seconds ago
hiveedu-db         postgres:15-alpine           "docker-entrypoint.s…"   db         About a minute ago   Up About a minute               0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
hiveedu-frontend   hiveedu-analytics-frontend   "docker-entrypoint.s…"   frontend   About a minute ago   Up About a minute               0.0.0.0:3001->3000/tcp, [::]:3001->3000/tcp
hiveedu-jenkins    hiveedu-analytics-jenkins    "/usr/bin/tini -- /u…"   jenkins    About a minute ago   Up About a minute               0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp, 0.0.0.0:50000->50000/tcp, [::]:50000->50000/tcp
hiveedu-nginx      nginx:alpine                 "/docker-entrypoint.…"   proxy      About a minute ago   Up About a minute               0.0.0.0:80->80/tcp, [::]:80->80/tcp
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$
deployer@vmi3475565:~/hiveedu-analytics$ docker compose logs -f backend
WARN[0000] /home/deployer/hiveedu-analytics/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.631Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.743Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +111ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.744Z [info] [InstanceLoader] PassportModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.745Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.746Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.747Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.747Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.748Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.751Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.752Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.752Z [info] [InstanceLoader] ConfigModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.753Z [info] [InstanceLoader] CacheModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.753Z [info] [InstanceLoader] ScheduleModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.754Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.800Z [info] [InstanceLoader] XaiModule dependencies initialized +46ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.801Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:45.801Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.026Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +225ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.029Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.031Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.032Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.032Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.033Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.033Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.034Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.038Z [info] [InstanceLoader] SeederModule dependencies initialized +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.039Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.047Z [info] [InstanceLoader] AuditLogModule dependencies initialized +8ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.047Z [info] [InstanceLoader] UsersModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.048Z [info] [InstanceLoader] InterventionsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.049Z [info] [InstanceLoader] AttendanceModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.049Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.049Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.050Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.051Z [info] [InstanceLoader] AuthModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.195Z [info] [RoutesResolver] AppController {/}: +144ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.202Z [info] [RouterExplorer] Mapped {/, GET} route +7ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.203Z [info] [RoutesResolver] UsersController {/users}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.206Z [info] [RouterExplorer] Mapped {/users, POST} route +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.207Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.209Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.210Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.211Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.212Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.214Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.217Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.223Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.225Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.225Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.226Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.228Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.228Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.229Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.229Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.230Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.230Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.231Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.232Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.232Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.233Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.233Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.234Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.234Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.234Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.235Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.236Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.236Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.237Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.237Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.237Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.238Z [info] [RoutesResolver] SeederController {/seeder}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.238Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.238Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.239Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.239Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.239Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.240Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.240Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.241Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.241Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.242Z [info] [RouterExplorer] Mapped {/attendance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.242Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.243Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.243Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.244Z [info] [RoutesResolver] InterventionsController {/interventions}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.244Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.245Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.245Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.246Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.246Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.246Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.247Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:46.247Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +0ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  | npm notice
hiveedu-backend  | npm notice New major version of npm available! 10.8.2 -> 12.0.2
hiveedu-backend  | npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
hiveedu-backend  | npm notice To update run: npm install -g npm@12.0.2
hiveedu-backend  | npm notice
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.031Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.115Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +84ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.115Z [info] [InstanceLoader] PassportModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.116Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.117Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.118Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.118Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.119Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.125Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.126Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.127Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.127Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.128Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.128Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.173Z [info] [InstanceLoader] XaiModule dependencies initialized +45ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.174Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.174Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.279Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +105ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.280Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.281Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.282Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.282Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.283Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.283Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.283Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.291Z [info] [InstanceLoader] SeederModule dependencies initialized +8ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.292Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.298Z [info] [InstanceLoader] AuditLogModule dependencies initialized +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.299Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.299Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.300Z [info] [InstanceLoader] AttendanceModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.300Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.301Z [info] [InstanceLoader] NotificationsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.301Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.302Z [info] [InstanceLoader] AuthModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.420Z [info] [RoutesResolver] AppController {/}: +118ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.429Z [info] [RouterExplorer] Mapped {/, GET} route +9ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.429Z [info] [RoutesResolver] UsersController {/users}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.431Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.432Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.432Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.433Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.433Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.434Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.434Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.435Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.436Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.436Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.437Z [info] [RoutesResolver] AnalyticsController {/analytics}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.437Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.438Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.438Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.439Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.439Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.440Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.440Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.441Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.441Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.442Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.442Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.443Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.443Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.443Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.444Z [info] [RoutesResolver] AuthController {/auth}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.444Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.445Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.445Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.446Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.447Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.447Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.448Z [info] [RoutesResolver] SeederController {/seeder}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.448Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.448Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.449Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.449Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.450Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.450Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.450Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.451Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.451Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.452Z [info] [RouterExplorer] Mapped {/attendance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.452Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.453Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.453Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.453Z [info] [RoutesResolver] InterventionsController {/interventions}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.454Z [info] [RouterExplorer] Mapped {/interventions, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.454Z [info] [RouterExplorer] Mapped {/interventions, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.455Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.455Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.455Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.456Z [info] [RoutesResolver] NotificationsController {/notifications}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.456Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:50.457Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:53.942Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.041Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +98ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.041Z [info] [InstanceLoader] PassportModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.042Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.043Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.044Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.044Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.044Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.047Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.048Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.049Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.049Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.050Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.050Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.095Z [info] [InstanceLoader] XaiModule dependencies initialized +45ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.096Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.097Z [info] [InstanceLoader] AppModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.212Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +115ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.213Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.214Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.214Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.214Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.214Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.214Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.215Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.218Z [info] [InstanceLoader] SeederModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.219Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.224Z [info] [InstanceLoader] AuditLogModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.225Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.225Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.225Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.226Z [info] [InstanceLoader] RecordsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.226Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.227Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.227Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.338Z [info] [RoutesResolver] AppController {/}: +111ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.344Z [info] [RouterExplorer] Mapped {/, GET} route +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.345Z [info] [RoutesResolver] UsersController {/users}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.346Z [info] [RouterExplorer] Mapped {/users, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.347Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.347Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.348Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.349Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.349Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.350Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.351Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.351Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.352Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.352Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.353Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.353Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.353Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.354Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.355Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.355Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.356Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.356Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.357Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.357Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.358Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.358Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.359Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.359Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.359Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.360Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.360Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.361Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.361Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.361Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.362Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.362Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.362Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.363Z [info] [RoutesResolver] RecordsController {/records}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.363Z [info] [RouterExplorer] Mapped {/records, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.363Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.364Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.364Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.365Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.365Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.365Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.365Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.366Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.366Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.366Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.367Z [info] [RoutesResolver] InterventionsController {/interventions}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.367Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.367Z [info] [RouterExplorer] Mapped {/interventions, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.368Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.368Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.369Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.369Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.369Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:54.370Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.817Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.888Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +71ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.888Z [info] [InstanceLoader] PassportModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.890Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.891Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.891Z [info] [InstanceLoader] JwtModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.892Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.892Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.895Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.896Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.896Z [info] [InstanceLoader] ConfigModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.897Z [info] [InstanceLoader] CacheModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.897Z [info] [InstanceLoader] ScheduleModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.897Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.958Z [info] [InstanceLoader] XaiModule dependencies initialized +61ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.959Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:58.959Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.101Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +142ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.103Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.103Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.104Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.106Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.106Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.106Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.107Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.110Z [info] [InstanceLoader] SeederModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.111Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.116Z [info] [InstanceLoader] AuditLogModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.117Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.117Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.117Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.117Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.118Z [info] [InstanceLoader] NotificationsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.118Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.119Z [info] [InstanceLoader] AuthModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.245Z [info] [RoutesResolver] AppController {/}: +126ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.252Z [info] [RouterExplorer] Mapped {/, GET} route +7ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.253Z [info] [RoutesResolver] UsersController {/users}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.255Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.257Z [info] [RouterExplorer] Mapped {/users, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.258Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.259Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.260Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.261Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.261Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.262Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.264Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.265Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.266Z [info] [RoutesResolver] AnalyticsController {/analytics}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.267Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.271Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.273Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.273Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.274Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.274Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.276Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.276Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.277Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.277Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.278Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.278Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.279Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.280Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.280Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.280Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.281Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.281Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.282Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.282Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.282Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.283Z [info] [RoutesResolver] SeederController {/seeder}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.283Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.284Z [info] [RoutesResolver] RecordsController {/records}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.284Z [info] [RouterExplorer] Mapped {/records, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.284Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.285Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.285Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.286Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.286Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.287Z [info] [RoutesResolver] AttendanceController {/attendance}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.287Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.288Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.289Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.289Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.290Z [info] [RoutesResolver] InterventionsController {/interventions}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.290Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.291Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.292Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.293Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.293Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.293Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.294Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:40:59.295Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.337Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.409Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +72ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.409Z [info] [InstanceLoader] PassportModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.410Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.411Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.411Z [info] [InstanceLoader] JwtModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.411Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.412Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.414Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.415Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.416Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.416Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.417Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.417Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.461Z [info] [InstanceLoader] XaiModule dependencies initialized +44ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.462Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.463Z [info] [InstanceLoader] AppModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.575Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +112ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.576Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.576Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.578Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.581Z [info] [InstanceLoader] SeederModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.582Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.587Z [info] [InstanceLoader] AuditLogModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.588Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.588Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.588Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.589Z [info] [InstanceLoader] RecordsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.589Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.589Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.590Z [info] [InstanceLoader] AuthModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.697Z [info] [RoutesResolver] AppController {/}: +107ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.703Z [info] [RouterExplorer] Mapped {/, GET} route +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.705Z [info] [RoutesResolver] UsersController {/users}: +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.707Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.707Z [info] [RouterExplorer] Mapped {/users, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.708Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.709Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.709Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.710Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.711Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.712Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.712Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.714Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.714Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.715Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.716Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.716Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.717Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.717Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.718Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.719Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.719Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.720Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.720Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.720Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.721Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.721Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.721Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.722Z [info] [RoutesResolver] AuthController {/auth}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.722Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.723Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.723Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.724Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.724Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.724Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.725Z [info] [RoutesResolver] SeederController {/seeder}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.725Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.725Z [info] [RoutesResolver] RecordsController {/records}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.726Z [info] [RouterExplorer] Mapped {/records, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.726Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.727Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.727Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.728Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.728Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.729Z [info] [RoutesResolver] AttendanceController {/attendance}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.729Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.729Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.730Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.730Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.731Z [info] [RoutesResolver] InterventionsController {/interventions}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.731Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.732Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.732Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.732Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.733Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.733Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.734Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:04.734Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +0ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.826Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.893Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +67ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.895Z [info] [InstanceLoader] PassportModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.897Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.898Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.899Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.899Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.899Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.902Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.903Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.904Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.904Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.905Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.905Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.943Z [info] [InstanceLoader] XaiModule dependencies initialized +38ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.944Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:09.944Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.050Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +106ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.052Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.053Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.053Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.053Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.054Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.054Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.054Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.059Z [info] [InstanceLoader] SeederModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.059Z [info] [InstanceLoader] CronModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.064Z [info] [InstanceLoader] AuditLogModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.065Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.065Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.065Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.065Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.065Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.066Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.066Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.192Z [info] [RoutesResolver] AppController {/}: +126ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.202Z [info] [RouterExplorer] Mapped {/, GET} route +10ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.202Z [info] [RoutesResolver] UsersController {/users}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.204Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.205Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.206Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.206Z [info] [RouterExplorer] Mapped {/users/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.207Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.208Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.209Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.210Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.210Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.211Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.211Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.213Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.216Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.217Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.220Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.221Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.222Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.222Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.223Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.223Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.224Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.224Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.225Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.225Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.225Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.226Z [info] [RoutesResolver] AuthController {/auth}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.228Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.228Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.228Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.229Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.229Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.229Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.229Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.230Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.230Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.231Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.231Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.232Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.232Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.232Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.233Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.233Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.233Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.234Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.234Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.236Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.236Z [info] [RoutesResolver] InterventionsController {/interventions}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.237Z [info] [RouterExplorer] Mapped {/interventions, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.238Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.239Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.240Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.241Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.241Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.242Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:10.242Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +0ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.597Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.671Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +73ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.672Z [info] [InstanceLoader] PassportModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.673Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.674Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.675Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.675Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.675Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.678Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.679Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.681Z [info] [InstanceLoader] ConfigModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.681Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.681Z [info] [InstanceLoader] ScheduleModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.682Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.723Z [info] [InstanceLoader] XaiModule dependencies initialized +41ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.724Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.725Z [info] [InstanceLoader] AppModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.835Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +110ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.836Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.836Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.837Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.837Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.837Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.837Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.837Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.840Z [info] [InstanceLoader] SeederModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.841Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.845Z [info] [InstanceLoader] AuditLogModule dependencies initialized +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.845Z [info] [InstanceLoader] UsersModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.846Z [info] [InstanceLoader] InterventionsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.846Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.846Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.846Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.847Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.847Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.934Z [info] [RoutesResolver] AppController {/}: +87ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.937Z [info] [RouterExplorer] Mapped {/, GET} route +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.938Z [info] [RoutesResolver] UsersController {/users}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.939Z [info] [RouterExplorer] Mapped {/users, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.939Z [info] [RouterExplorer] Mapped {/users, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.940Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.940Z [info] [RouterExplorer] Mapped {/users/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.941Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.942Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.942Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.943Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.943Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.944Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.944Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.945Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.945Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.946Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.946Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.947Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.947Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.948Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.948Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.949Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.949Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.950Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.950Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.951Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.951Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.951Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.952Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.952Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.954Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.955Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.955Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.956Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.956Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.956Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.956Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.957Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.957Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.958Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.958Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.958Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.959Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.959Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.959Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.960Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.960Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.960Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.961Z [info] [RoutesResolver] InterventionsController {/interventions}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.961Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.962Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.963Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.963Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.963Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.964Z [info] [RoutesResolver] NotificationsController {/notifications}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.964Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:16.964Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +0ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.839Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.905Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +66ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.905Z [info] [InstanceLoader] PassportModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.906Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.907Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.908Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.908Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.909Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.913Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.913Z [info] [InstanceLoader] ConfigModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.914Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.914Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.915Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.915Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.960Z [info] [InstanceLoader] XaiModule dependencies initialized +45ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.961Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:26.961Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.058Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +97ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.059Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.060Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.060Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.060Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.060Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.060Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.060Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.063Z [info] [InstanceLoader] SeederModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.064Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.067Z [info] [InstanceLoader] AuditLogModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.067Z [info] [InstanceLoader] UsersModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.067Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.068Z [info] [InstanceLoader] AttendanceModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.068Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.068Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.069Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.069Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.163Z [info] [RoutesResolver] AppController {/}: +94ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.167Z [info] [RouterExplorer] Mapped {/, GET} route +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.167Z [info] [RoutesResolver] UsersController {/users}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.169Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.170Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.170Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.171Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.171Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.172Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.173Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.174Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.174Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.175Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.175Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.176Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.176Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.177Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.177Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.178Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.178Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.178Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.179Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.179Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.180Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.180Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.181Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.181Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.181Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.181Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.182Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.182Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.183Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.183Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.183Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.184Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.184Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.184Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.184Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.185Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.185Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.185Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.186Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.186Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.187Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.187Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.187Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.188Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.190Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.190Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.190Z [info] [RoutesResolver] InterventionsController {/interventions}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.191Z [info] [RouterExplorer] Mapped {/interventions, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.191Z [info] [RouterExplorer] Mapped {/interventions, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.191Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.192Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.192Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.193Z [info] [RoutesResolver] NotificationsController {/notifications}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.193Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:27.193Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +0ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:42.975Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.037Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +62ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.038Z [info] [InstanceLoader] PassportModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.040Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.041Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.041Z [info] [InstanceLoader] JwtModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.042Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.042Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.045Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.046Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.047Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.047Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.048Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.048Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.094Z [info] [InstanceLoader] XaiModule dependencies initialized +46ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.095Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.095Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.196Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +101ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.201Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.202Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.203Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.203Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.203Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.203Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.204Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.218Z [info] [InstanceLoader] SeederModule dependencies initialized +14ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.219Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.227Z [info] [InstanceLoader] AuditLogModule dependencies initialized +8ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.228Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.228Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.228Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.229Z [info] [InstanceLoader] RecordsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.229Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.230Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.230Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.338Z [info] [RoutesResolver] AppController {/}: +108ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.342Z [info] [RouterExplorer] Mapped {/, GET} route +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.344Z [info] [RoutesResolver] UsersController {/users}: +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.345Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.347Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.348Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.349Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.351Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.352Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.358Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.360Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.361Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.364Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.365Z [info] [RoutesResolver] AnalyticsController {/analytics}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.374Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +9ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.375Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.375Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.376Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.382Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.383Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.383Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.384Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.384Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.385Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.386Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.386Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.388Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.389Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.389Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.390Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.390Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.391Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.391Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.392Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.392Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.393Z [info] [RoutesResolver] SeederController {/seeder}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.393Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.393Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.394Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.395Z [info] [RouterExplorer] Mapped {/records, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.395Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.395Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.396Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.396Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.397Z [info] [RoutesResolver] AttendanceController {/attendance}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.398Z [info] [RouterExplorer] Mapped {/attendance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.398Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.399Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.401Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.402Z [info] [RoutesResolver] InterventionsController {/interventions}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.403Z [info] [RouterExplorer] Mapped {/interventions, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.403Z [info] [RouterExplorer] Mapped {/interventions, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.404Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.404Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.405Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.405Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.405Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:41:43.406Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.619Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.694Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +74ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.695Z [info] [InstanceLoader] PassportModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.697Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.698Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.698Z [info] [InstanceLoader] JwtModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.699Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.699Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.702Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.703Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.703Z [info] [InstanceLoader] ConfigModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.704Z [info] [InstanceLoader] CacheModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.704Z [info] [InstanceLoader] ScheduleModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.704Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.749Z [info] [InstanceLoader] XaiModule dependencies initialized +45ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.750Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.751Z [info] [InstanceLoader] AppModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.858Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +107ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.859Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.859Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.860Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.860Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.860Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.861Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.861Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.864Z [info] [InstanceLoader] SeederModule dependencies initialized +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.864Z [info] [InstanceLoader] CronModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.869Z [info] [InstanceLoader] AuditLogModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.869Z [info] [InstanceLoader] UsersModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.869Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.869Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.870Z [info] [InstanceLoader] RecordsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.870Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.870Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.870Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.963Z [info] [RoutesResolver] AppController {/}: +93ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.967Z [info] [RouterExplorer] Mapped {/, GET} route +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.967Z [info] [RoutesResolver] UsersController {/users}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.969Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.971Z [info] [RouterExplorer] Mapped {/users, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.971Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.972Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.973Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.974Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.975Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.976Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.976Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.977Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.977Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.978Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.979Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.979Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.980Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.980Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.981Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.981Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.982Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.982Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.983Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.983Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.984Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.984Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.985Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.985Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.985Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.986Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.986Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.987Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.987Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.988Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.988Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.988Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.989Z [info] [RoutesResolver] RecordsController {/records}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.989Z [info] [RouterExplorer] Mapped {/records, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.989Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.990Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.990Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.990Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.990Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.991Z [info] [RoutesResolver] AttendanceController {/attendance}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.991Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.992Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.992Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.993Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.993Z [info] [RoutesResolver] InterventionsController {/interventions}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.993Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.993Z [info] [RouterExplorer] Mapped {/interventions, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.994Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.994Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.995Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.995Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.995Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:42:12.996Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.649Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.756Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +107ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.756Z [info] [InstanceLoader] PassportModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.758Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.758Z [info] [InstanceLoader] HttpModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.759Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.760Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.760Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.763Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.764Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.765Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.765Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.766Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.766Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.813Z [info] [InstanceLoader] XaiModule dependencies initialized +47ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.814Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.814Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.953Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +139ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.954Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.954Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.954Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.955Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.955Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.955Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.955Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.959Z [info] [InstanceLoader] SeederModule dependencies initialized +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.960Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.967Z [info] [InstanceLoader] AuditLogModule dependencies initialized +7ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.967Z [info] [InstanceLoader] UsersModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.968Z [info] [InstanceLoader] InterventionsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.968Z [info] [InstanceLoader] AttendanceModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.968Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.968Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.969Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:07.969Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.082Z [info] [RoutesResolver] AppController {/}: +113ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.089Z [info] [RouterExplorer] Mapped {/, GET} route +7ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.089Z [info] [RoutesResolver] UsersController {/users}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.091Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.092Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.093Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.093Z [info] [RouterExplorer] Mapped {/users/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.094Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.095Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.096Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.097Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.097Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.098Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.098Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.099Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.099Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.100Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.100Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.100Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.101Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.101Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.105Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +4ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.107Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.108Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.108Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.109Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.109Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.109Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.109Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.110Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.110Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.110Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.111Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.111Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.112Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.112Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.112Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.112Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.113Z [info] [RouterExplorer] Mapped {/records, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.113Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.113Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.114Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.114Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.114Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.115Z [info] [RoutesResolver] AttendanceController {/attendance}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.115Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.117Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.118Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.119Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.119Z [info] [RoutesResolver] InterventionsController {/interventions}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.119Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.120Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.120Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.120Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.121Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.122Z [info] [RoutesResolver] NotificationsController {/notifications}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.122Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:43:08.123Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | /app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216
hiveedu-backend  |             throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
hiveedu-backend  |                   ^
hiveedu-backend  |
hiveedu-backend  | QueryFailedError: relation "system_config" does not exist
hiveedu-backend  |     at PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:216:19)
hiveedu-backend  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |     at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |     at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |     at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |     at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |     at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |     at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |     at async Promise.all (index 0)
hiveedu-backend  |     at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |     at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |     at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |     at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |     at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |   query: 'SELECT "SystemConfig"."configId" AS "SystemConfig_configId", "SystemConfig"."intercept" AS "SystemConfig_intercept", "SystemConfig"."attendanceCoefficient" AS "SystemConfig_attendanceCoefficient", "SystemConfig"."tryoutCoefficient" AS "SystemConfig_tryoutCoefficient", "SystemConfig"."teacherObjectiveCoefficient" AS "SystemConfig_teacherObjectiveCoefficient", "SystemConfig"."coefficientMode" AS "SystemConfig_coefficientMode", "SystemConfig"."x1Weight" AS "SystemConfig_x1Weight", "SystemConfig"."x2Weight" AS "SystemConfig_x2Weight", "SystemConfig"."x3Weight" AS "SystemConfig_x3Weight", "SystemConfig"."createdAt" AS "SystemConfig_createdAt", "SystemConfig"."updatedAt" AS "SystemConfig_updatedAt" FROM "system_config" "SystemConfig" ORDER BY "SystemConfig"."createdAt" ASC LIMIT 1',
hiveedu-backend  |   parameters: [],
hiveedu-backend  |   driverError: error: relation "system_config" does not exist
hiveedu-backend  |       at /app/node_modules/pg/lib/client.js:631:17
hiveedu-backend  |       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
hiveedu-backend  |       at async PostgresQueryRunner.query (/app/node_modules/typeorm/driver/postgres/PostgresQueryRunner.js:181:25)
hiveedu-backend  |       at async SelectQueryBuilder.loadRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2231:25)
hiveedu-backend  |       at async SelectQueryBuilder.executeEntitiesAndRawResults (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:2079:26)
hiveedu-backend  |       at async SelectQueryBuilder.getRawAndEntities (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:684:29)
hiveedu-backend  |       at async SelectQueryBuilder.getMany (/app/node_modules/typeorm/query-builder/SelectQueryBuilder.js:750:25)
hiveedu-backend  |       at async AnalyticsService.ensureSystemConfig (/app/dist/analytics/analytics.service.js:105:33)
hiveedu-backend  |       at async AnalyticsService.onModuleInit (/app/dist/analytics/analytics.service.js:90:9)
hiveedu-backend  |       at async Promise.all (index 0)
hiveedu-backend  |       at async callModuleInitHook (/app/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:5)
hiveedu-backend  |       at async NestApplication.callInitHook (/app/node_modules/@nestjs/core/nest-application-context.js:252:13)
hiveedu-backend  |       at async NestApplication.init (/app/node_modules/@nestjs/core/nest-application.js:103:9)
hiveedu-backend  |       at async NestApplication.listen (/app/node_modules/@nestjs/core/nest-application.js:175:13)
hiveedu-backend  |       at async bootstrap (/app/dist/main.js:93:5) {
hiveedu-backend  |     length: 113,
hiveedu-backend  |     severity: 'ERROR',
hiveedu-backend  |     code: '42P01',
hiveedu-backend  |     detail: undefined,
hiveedu-backend  |     hint: undefined,
hiveedu-backend  |     position: '708',
hiveedu-backend  |     internalPosition: undefined,
hiveedu-backend  |     internalQuery: undefined,
hiveedu-backend  |     where: undefined,
hiveedu-backend  |     schema: undefined,
hiveedu-backend  |     table: undefined,
hiveedu-backend  |     column: undefined,
hiveedu-backend  |     dataType: undefined,
hiveedu-backend  |     constraint: undefined,
hiveedu-backend  |     file: 'parse_relation.c',
hiveedu-backend  |     line: '1392',
hiveedu-backend  |     routine: 'parserOpenTable'
hiveedu-backend  |   },
hiveedu-backend  |   length: 113,
hiveedu-backend  |   severity: 'ERROR',
hiveedu-backend  |   code: '42P01',
hiveedu-backend  |   detail: undefined,
hiveedu-backend  |   hint: undefined,
hiveedu-backend  |   position: '708',
hiveedu-backend  |   internalPosition: undefined,
hiveedu-backend  |   internalQuery: undefined,
hiveedu-backend  |   where: undefined,
hiveedu-backend  |   schema: undefined,
hiveedu-backend  |   table: undefined,
hiveedu-backend  |   column: undefined,
hiveedu-backend  |   dataType: undefined,
hiveedu-backend  |   constraint: undefined,
hiveedu-backend  |   file: 'parse_relation.c',
hiveedu-backend  |   line: '1392',
hiveedu-backend  |   routine: 'parserOpenTable'
hiveedu-backend  | }
hiveedu-backend  |
hiveedu-backend  | Node.js v20.20.2
hiveedu-backend exited with code 1 (restarting)

