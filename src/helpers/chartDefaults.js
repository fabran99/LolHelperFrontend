export const radarDatasetStylesAvg = {
  backgroundColor: "rgba(200,200,200,0.3)",
  borderColor: "rgba(200,200,200,0.35)",
};

export const radarDatasetStylesSelected = {
  backgroundColor: "rgba(20, 163, 230, 0.7)",
  borderColor: "rgba(20, 163, 230, 0.8)",
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
      fontSize: 11,
    },
  },
  legend: {
    labels: {
      fontColor: "rgba(255,255,255,0.5)",
      fontSize: 12,
      usePointStyle: true,
      boxWidth: 5,
    },
    position: "bottom",
  },
  tooltips: {
    enabled: false,
  },
};

export const doughnutOptions = {
  rotation: -Math.PI,
  legend: {
    labels: {
      fontColor: "rgba(255,255,255,0.5)",
      fontSize: 12,
      usePointStyle: true,
      boxWidth: 5,
    },
    position: "bottom",
  },
  layout: {
    padding: {
      left: 110,
      right: 110,
    },
  },
  circumference: Math.PI,
};

export const doughnutDatasetStyles = {
  borderWidth: 0,
  borderColor: "rgba(200, 200,200,0.4)",
  backgroundColor: ["#f13242", "#14a3e6", "#69fd89"],
};
