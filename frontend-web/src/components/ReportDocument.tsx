import React from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, StyleSheet, Text, View, Image } from '@react-pdf/renderer';

const colors = {
  ink: '#111827',
  muted: '#64748b',
  line: '#dbe3ee',
  softLine: '#edf2f7',
  blue: '#1d4ed8',
  paleBlue: '#eff6ff',
  zinc: '#f8fafc',
  cream: '#fffdf8',
};

const styles = StyleSheet.create({
  page: {
    padding: 34,
    backgroundColor: colors.cream,
    color: colors.ink,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
    paddingBottom: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.blue,
    letterSpacing: -0.4,
  },
  brandMeta: {
    marginTop: 4,
    fontSize: 8,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  titleBlock: {
    textAlign: 'right',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.ink,
    textTransform: 'uppercase',
  },
  date: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 9,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.blue,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  identityGrid: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
  },
  identityRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.softLine,
  },
  identityLabel: {
    width: '30%',
    padding: 5,
    backgroundColor: colors.zinc,
    color: colors.muted,
    fontSize: 9,
    fontWeight: 'bold',
  },
  identityValue: {
    width: '70%',
    padding: 5,
    color: colors.ink,
    fontSize: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.softLine,
  },
  tableHeader: {
    backgroundColor: colors.paleBlue,
  },
  tableCellHeader: {
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.blue,
    textTransform: 'uppercase',
  },
  tableCell: {
    padding: 5,
    fontSize: 9.5,
    color: colors.ink,
  },
  colWide: {
    width: '46%',
  },
  colSmall: {
    width: '18%',
  },
  twoCol: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  twoColLeft: {
    width: '49%',
    marginRight: '2%',
  },
  twoColRight: {
    width: '49%',
  },
  noteBox: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
    padding: 8,
    minHeight: 42,
  },
  noteText: {
    color: colors.ink,
    lineHeight: 1.45,
    fontSize: 10,
  },
  predictionPanel: {
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: colors.paleBlue,
    padding: 8,
    marginTop: 2,
  },
  predictionValue: {
    fontSize: 26,
    color: colors.blue,
    fontWeight: 'bold',
  },
  riskText: {
    marginTop: 5,
    fontSize: 10,
    color: colors.ink,
    fontWeight: 'bold',
  },
  signatureArea: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '42%',
    height: 46,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 9,
  },
  qrCodeBox: {
    width: '16%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeImage: {
    width: 48,
    height: 48,
  },
  qrCodeText: {
    fontSize: 6,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  analyticsCard: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 14,
  },
  analyticsValue: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.blue,
  },
  formulaBox: {
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f8fafc',
    padding: 14,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.ink,
  },
  explanation: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 1.55,
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 34,
    right: 34,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
  },
});

interface ReportData {
  userName: string;
  fullName?: string;
  username?: string;
  period?: string;
  x1: string;
  x2: string;
  x3?: string;
  mathScore?: string;
  logicScore?: string;
  englishScore?: string;
  averageScore?: string;
  actualExamScore?: string;
  teacherObjectiveScore?: string;
  presentCount?: string;
  lateCount?: string;
  absentCount?: string;
  predictedScore: string;
  riskLevel?: string;
  recommendation?: string;
  teacherNote?: string;
  coefficientMode?: string;
  qrCodeUrl?: string;
  date: string;
}

const valueOrNA = (value?: string) => value || 'N/A';

const ReportDocument = ({ data }: { data: ReportData }) => {
  const { t } = useTranslation();
  const teacherObjectiveScore = valueOrNA(data.teacherObjectiveScore ?? data.x3);
  const displayName = valueOrNA(data.fullName ?? data.userName);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>HiveEdu</Text>
            <Text style={styles.brandMeta}>{t("components.report_system")}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{t("components.report_formal")}</Text>
            <Text style={styles.date}>{t("components.report_generated_prefix")}{data.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("components.report_user_identity")}</Text>
          <View style={styles.identityGrid}>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>{t("components.report_fullname")}</Text>
              <Text style={styles.identityValue}>{displayName}</Text>
            </View>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>{t("components.report_username")}</Text>
              <Text style={styles.identityValue}>{valueOrNA(data.username ?? data.userName)}</Text>
            </View>
            <View style={styles.identityRow}>
              <Text style={styles.identityLabel}>{t("components.report_period")}</Text>
              <Text style={styles.identityValue}>{valueOrNA(data.period ?? data.date)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("components.report_academic_results")}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellHeader, styles.colWide]}>{t("components.report_component")}</Text>
              <Text style={[styles.tableCellHeader, styles.colSmall]}>{t("components.report_score")}</Text>
              <Text style={[styles.tableCellHeader, styles.colWide]}>{t("components.report_notes")}</Text>
            </View>
            {[
              [t("components.report_mathematics"), valueOrNA(data.mathScore), t("components.report_desc_competency")],
              [t("components.report_logical_reasoning"), valueOrNA(data.logicScore), t("components.report_desc_competency")],
              [t("components.report_english"), valueOrNA(data.englishScore), t("components.report_desc_competency")],
              [t("components.report_average_score"), valueOrNA(data.averageScore ?? data.x2), t("components.report_desc_average")],
              [t("components.report_actual_exam_score"), valueOrNA(data.actualExamScore), t("components.report_desc_actual")],
              [t("components.report_teacher_objective_score"), teacherObjectiveScore, t("components.report_desc_teacher")],
            ].map(([label, score, note]) => (
              <View style={styles.tableRow} key={label}>
                <Text style={[styles.tableCell, styles.colWide]}>{label}</Text>
                <Text style={[styles.tableCell, styles.colSmall]}>{score}</Text>
                <Text style={[styles.tableCell, styles.colWide]}>{note}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.twoColLeft}>
            <Text style={styles.sectionTitle}>{t("components.report_attendance_summary")}</Text>
            <View style={styles.table}>
              {[
                [t("components.report_present"), valueOrNA(data.presentCount)],
                [t("components.report_late"), valueOrNA(data.lateCount)],
                [t("components.report_absent"), valueOrNA(data.absentCount)],
                [t("components.report_attendance_percentage"), valueOrNA(data.x1)],
              ].map(([label, value]) => (
                <View style={styles.tableRow} key={label}>
                  <Text style={[styles.tableCell, { width: '62%' }]}>{label}</Text>
                  <Text style={[styles.tableCell, { width: '38%' }]}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.twoColRight}>
            <Text style={styles.sectionTitle}>{t("components.report_predictive_summary")}</Text>
            <View style={styles.predictionPanel}>
              <Text style={styles.sectionTitle}>{t("components.report_predicted_next")}</Text>
              <Text style={styles.predictionValue}>{data.predictedScore}</Text>
              <Text style={styles.riskText}>{t("components.report_risk_level")}{valueOrNA(data.riskLevel)}</Text>
              <Text style={styles.explanation}>{data.recommendation || t("components.report_maintain_progress")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("components.report_teacher_note")}</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              {data.teacherNote || data.recommendation || t("components.report_maintain_progress")}
            </Text>
          </View>
        </View>

        <View style={styles.signatureArea}>
          <Text style={styles.signatureBox}>{t("components.report_homeroom")}</Text>
          {data.qrCodeUrl && (
            <View style={styles.qrCodeBox}>
              <Image src={data.qrCodeUrl} style={styles.qrCodeImage} />
              <Text style={styles.qrCodeText}>Scan to Verify</Text>
            </View>
          )}
          <Text style={styles.signatureBox}>{t("components.report_parent")}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("components.report_footer_1")}</Text>
          <Text style={styles.footerText}>{t("components.report_page_1")}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>HiveEdu</Text>
            <Text style={styles.brandMeta}>{t("components.report_appendix")}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{t("components.report_analytics_summary")}</Text>
            <Text style={styles.date}>{displayName}</Text>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.twoColLeft}>
            <View style={styles.analyticsCard}>
              <Text style={styles.sectionTitle}>{t("components.report_x1")}</Text>
              <Text style={styles.analyticsValue}>{valueOrNA(data.x1)}</Text>
            </View>
          </View>
          <View style={styles.twoColRight}>
            <View style={styles.analyticsCard}>
              <Text style={styles.sectionTitle}>{t("components.report_x2")}</Text>
              <Text style={styles.analyticsValue}>{valueOrNA(data.x2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.sectionTitle}>{t("components.report_x3")}</Text>
          <Text style={styles.analyticsValue}>{teacherObjectiveScore}</Text>
          <Text style={styles.explanation}>
            {t("components.report_x3_desc")}
          </Text>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.sectionTitle}>{t("components.report_mode")}</Text>
          <Text style={styles.analyticsValue}>{valueOrNA(data.coefficientMode)}</Text>
          <Text style={styles.explanation}>
            {t("components.report_mode_desc")}
          </Text>
        </View>

        <View style={styles.formulaBox}>
          <Text style={styles.sectionTitle}>{t("components.report_formula")}</Text>
          <Text style={styles.formulaText}>{t("components.report_formula_y")}</Text>
          <Text style={styles.explanation}>
            {t("components.report_formula_desc_full")}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("components.report_footer_2")}</Text>
          <Text style={styles.footerText}>{t("components.report_page_2")}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;
