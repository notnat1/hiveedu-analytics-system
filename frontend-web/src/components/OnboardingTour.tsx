"use client";

import { useEffect, useState } from "react";
import { Joyride, Step, STATUS } from "react-joyride";
import { useTranslation } from "react-i18next";

export default function OnboardingTour({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const [run, setRun] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem("hiveEdu_hasSeenTour");
    if (!hasSeenTour) {
      // Small delay to ensure all DOM elements are mounted
      setTimeout(() => {
        setRun(true);
      }, 1000);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "body",
      content: t("tour.step1"),
      placement: "center",
      // @ts-expect-error type change in v3
      disableBeacon: true,
    },
    {
      target: "#tour-sidebar",
      content: t("tour.step2"),
      placement: "right",
    },
    {
      target: "#tour-theme-toggle",
      content: t("tour.step3"),
      placement: "bottom",
    },
    {
      target: "#tour-logout",
      content: t("tour.step4"),
      placement: "bottom",
    },
    {
      target: "main",
      content: t("tour.step5"),
      placement: "top",
    }
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("hiveEdu_hasSeenTour", "true");
    }
  };

  return (
    <Joyride
        locale={{
          back: t("components.joyride_back"),
          close: t("components.joyride_close"),
          last: t("components.joyride_last"),
          next: t("components.joyride_next"),
          skip: t("components.joyride_skip"),
        }}
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        // @ts-expect-error type change in v3
        options: {
          primaryColor: "#06b6d4", // Cyan 500
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "12px",
          backgroundColor: theme === "light" ? "#ffffff" : "#18181b", // White or Zinc 900
          color: theme === "light" ? "#18181b" : "#f4f4f5", // Zinc 900 or Zinc 50
        },
        buttonNext: {
          backgroundColor: "#06b6d4",
        },
        buttonBack: {
          color: "#a1a1aa", // Zinc 400
        }
      }}
    />
  );
}
