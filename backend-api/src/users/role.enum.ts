/**
 * Role â€” Defines the RBAC roles for the HiveEdu E-Raport platform.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 *
 * - ADMIN   â†’ Data entry operator (manages records, system configuration)
 * - TEACHER â†’ Provides objective/subjective inputs and assessments
 * - USER    â†’ USER role account (views predictions, reports, and scores)
 */
export enum Role {
  /** Data entry operator â€” manages records and system configuration */
  ADMIN = 'ADMIN',

  /** Teacher â€” provides objective inputs, assessments, and scores */
  TEACHER = 'TEACHER',

  /** USER role account â€” views predictions, reports, and e-raport data */
  USER = 'USER',
}
