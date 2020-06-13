export const radarDatasetStylesAvg = {
  backgroundColor: "rgba(200,200,200,0.3)",
  borderColor: "rgba(200,200,200,0.35)",
};

export const radarDatasetStylesSelected = {
  backgroundColor: "rgba(20, 163, 230, 0.6)",
  borderColor: "rgba(20, 163, 230, 0.7)",
};

export const radarPointStylesAvg = {
  pointBackgroundColor: "rgba(255,255,255,0.2)",
};

export const radarOptions = {
  scale: {
    ticks: {
      callback: function () {
        return "";
      },
      backdropColor: "rgba(0, 0, 0, 0)",
      min: 0,
      max: 100,
      steps: 20,
    },
    gridLines: {
      color: "rgba(255,255,255,0.1)",
    },
    angleLines: {
      color: "rgba(255,255,255,0.1)",
    },
    pointLabels: {
      fontSize: 13,
    },
  },
  legend: {
    labels: { fontColor: "rgba(255,255,255,0.5)", fontSize: 14 },
  },
  tooltips: {
    enabled: false,
  },
};
