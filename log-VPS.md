deployer@vmi3475565:~/hiveedu-analytics$ sudo docker compose logs -f backend
WARN[0000] /home/deployer/hiveedu-analytics/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
hiveedu-backend  |
hiveedu-backend  | > backend-api@0.0.1 start:prod
hiveedu-backend  | > node dist/main
hiveedu-backend  |
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.073Z [info] [NestFactory] Starting Nest application... +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.148Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +75ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.149Z [info] [InstanceLoader] PassportModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.150Z [info] [InstanceLoader] ConfigHostModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.151Z [info] [InstanceLoader] HttpModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.152Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.153Z [info] [InstanceLoader] ThrottlerModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.153Z [info] [InstanceLoader] DiscoveryModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.156Z [warn] [XaiService] GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations. +3ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.157Z [info] [InstanceLoader] ConfigModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.157Z [info] [InstanceLoader] ConfigModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.157Z [info] [InstanceLoader] CacheModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.158Z [info] [InstanceLoader] ScheduleModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.158Z [info] [InstanceLoader] EventEmitterModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.203Z [info] [InstanceLoader] XaiModule dependencies initialized +45ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.204Z [info] [InstanceLoader] JwtModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.204Z [info] [InstanceLoader] AppModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.573Z [info] [InstanceLoader] TypeOrmCoreModule dependencies initialized +369ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.574Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.575Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.575Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.576Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.577Z [info] [InstanceLoader] TypeOrmModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.582Z [info] [InstanceLoader] SeederModule dependencies initialized +5ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.583Z [info] [InstanceLoader] CronModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.589Z [info] [InstanceLoader] AuditLogModule dependencies initialized +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.590Z [info] [InstanceLoader] UsersModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.590Z [info] [InstanceLoader] InterventionsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.591Z [info] [InstanceLoader] AttendanceModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.591Z [info] [InstanceLoader] RecordsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.591Z [info] [InstanceLoader] NotificationsModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.592Z [info] [InstanceLoader] AnalyticsModule dependencies initialized +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.592Z [info] [InstanceLoader] AuthModule dependencies initialized +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.703Z [info] [RoutesResolver] AppController {/}: +111ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.709Z [info] [RouterExplorer] Mapped {/, GET} route +6ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.710Z [info] [RoutesResolver] UsersController {/users}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.712Z [info] [RouterExplorer] Mapped {/users, POST} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.713Z [info] [RouterExplorer] Mapped {/users, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.714Z [info] [RouterExplorer] Mapped {/users/role/user, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.715Z [info] [RouterExplorer] Mapped {/users/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.716Z [info] [RouterExplorer] Mapped {/users/me, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.717Z [info] [RouterExplorer] Mapped {/users/:id/features, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.718Z [info] [RouterExplorer] Mapped {/users/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.720Z [info] [RouterExplorer] Mapped {/users/:id, DELETE} route +2ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.721Z [info] [RoutesResolver] AuditLogController {/audit-logs}: +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.722Z [info] [RouterExplorer] Mapped {/audit-logs, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.722Z [info] [RoutesResolver] AnalyticsController {/analytics}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.723Z [info] [RouterExplorer] Mapped {/analytics/predict-performance, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.724Z [info] [RouterExplorer] Mapped {/analytics/me, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.724Z [info] [RouterExplorer] Mapped {/analytics/config, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.725Z [info] [RouterExplorer] Mapped {/analytics/tutors, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.725Z [info] [RouterExplorer] Mapped {/analytics/global, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.726Z [info] [RouterExplorer] Mapped {/analytics/export, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.726Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.727Z [info] [RouterExplorer] Mapped {/analytics/mlr-run-history/:id, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.728Z [info] [RouterExplorer] Mapped {/analytics/config, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.728Z [info] [RouterExplorer] Mapped {/analytics/dashboard, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.729Z [info] [RouterExplorer] Mapped {/analytics/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.729Z [info] [RouterExplorer] Mapped {/analytics/chat, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.730Z [info] [RouterExplorer] Mapped {/analytics/draft-intervention, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.730Z [info] [RouterExplorer] Mapped {/analytics/study-plan, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.730Z [info] [RoutesResolver] AuthController {/auth}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.731Z [info] [RouterExplorer] Mapped {/auth/register, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.731Z [info] [RouterExplorer] Mapped {/auth/login, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.731Z [info] [RouterExplorer] Mapped {/auth/login/2fa, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.732Z [info] [RouterExplorer] Mapped {/auth/2fa/generate, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.732Z [info] [RouterExplorer] Mapped {/auth/2fa/verify-setup, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.732Z [info] [RouterExplorer] Mapped {/auth/2fa/disable, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.732Z [info] [RoutesResolver] SeederController {/seeder}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.733Z [info] [RouterExplorer] Mapped {/seeder/run, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.733Z [info] [RoutesResolver] RecordsController {/records}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.733Z [info] [RouterExplorer] Mapped {/records, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.733Z [info] [RouterExplorer] Mapped {/records, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.734Z [info] [RouterExplorer] Mapped {/records/bulk-import, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.734Z [info] [RouterExplorer] Mapped {/records/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.734Z [info] [RouterExplorer] Mapped {/records/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.735Z [info] [RouterExplorer] Mapped {/records/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.735Z [info] [RoutesResolver] AttendanceController {/attendance}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.735Z [info] [RouterExplorer] Mapped {/attendance, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.735Z [info] [RouterExplorer] Mapped {/attendance/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.736Z [info] [RouterExplorer] Mapped {/attendance/:id, PATCH} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.736Z [info] [RouterExplorer] Mapped {/attendance/:id, DELETE} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.736Z [info] [RoutesResolver] InterventionsController {/interventions}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.736Z [info] [RouterExplorer] Mapped {/interventions, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.737Z [info] [RouterExplorer] Mapped {/interventions, GET} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.737Z [info] [RouterExplorer] Mapped {/interventions/user/:userId, GET} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.737Z [info] [RouterExplorer] Mapped {/interventions/:id, PATCH} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.738Z [info] [RouterExplorer] Mapped {/interventions/:id, DELETE} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.738Z [info] [RoutesResolver] NotificationsController {/notifications}: +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.738Z [info] [RouterExplorer] Mapped {/notifications/webhook, POST} route +0ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.739Z [info] [RouterExplorer] Mapped {/notifications/send, POST} route +1ms
hiveedu-backend  | [HiveEdu] 2026-08-09T15:46:38.839Z [info] [NestApplication] Nest application successfully started +100ms

