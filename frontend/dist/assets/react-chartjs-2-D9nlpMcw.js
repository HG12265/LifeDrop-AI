import { r as reactExports, j as jsxRuntimeExports } from "./react-Djfz7pm2.js";
import { C as Chart$1, D as DoughnutController, B as BarController } from "./chart.js-C3tolcP7.js";
const defaultDatasetIdKey = "label";
function reforwardRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
function setOptions(chart, nextOptions) {
  const options = chart.options;
  if (options && nextOptions) {
    Object.assign(options, nextOptions);
  }
}
function setLabels(currentData, nextLabels) {
  currentData.labels = nextLabels;
}
function setDatasets(currentData, nextDatasets, datasetIdKey = defaultDatasetIdKey) {
  const addedDatasets = [];
  currentData.datasets = nextDatasets.map((nextDataset) => {
    const currentDataset = currentData.datasets.find((dataset) => dataset[datasetIdKey] === nextDataset[datasetIdKey]);
    if (!currentDataset || !nextDataset.data || addedDatasets.includes(currentDataset)) {
      return {
        ...nextDataset
      };
    }
    addedDatasets.push(currentDataset);
    Object.assign(currentDataset, nextDataset);
    return currentDataset;
  });
}
function cloneData(data, datasetIdKey = defaultDatasetIdKey) {
  const nextData = {
    labels: [],
    datasets: []
  };
  setLabels(nextData, data.labels);
  setDatasets(nextData, data.datasets, datasetIdKey);
  return nextData;
}
function ChartComponent(props, ref) {
  const { height = 150, width = 300, redraw = false, datasetIdKey, type, data, options, plugins = [], fallbackContent, updateMode, ...canvasProps } = props;
  const canvasRef = reactExports.useRef(null);
  const chartRef = reactExports.useRef(null);
  const renderChart = () => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart$1(canvasRef.current, {
      type,
      data: cloneData(data, datasetIdKey),
      options: options && {
        ...options
      },
      plugins
    });
    reforwardRef(ref, chartRef.current);
  };
  const destroyChart = () => {
    reforwardRef(ref, null);
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };
  reactExports.useEffect(() => {
    if (!redraw && chartRef.current && options) {
      setOptions(chartRef.current, options);
    }
  }, [
    redraw,
    options
  ]);
  reactExports.useEffect(() => {
    if (!redraw && chartRef.current) {
      setLabels(chartRef.current.config.data, data.labels);
    }
  }, [
    redraw,
    data.labels
  ]);
  reactExports.useEffect(() => {
    if (!redraw && chartRef.current && data.datasets) {
      setDatasets(chartRef.current.config.data, data.datasets, datasetIdKey);
    }
  }, [
    redraw,
    data.datasets
  ]);
  reactExports.useEffect(() => {
    if (!chartRef.current) return;
    if (redraw) {
      destroyChart();
      setTimeout(renderChart);
    } else {
      chartRef.current.update(updateMode);
    }
  }, [
    redraw,
    options,
    data.labels,
    data.datasets,
    updateMode
  ]);
  reactExports.useEffect(() => {
    if (!chartRef.current) return;
    destroyChart();
    setTimeout(renderChart);
  }, [
    type
  ]);
  reactExports.useEffect(() => {
    renderChart();
    return () => destroyChart();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", {
    ref: canvasRef,
    role: "img",
    height,
    width,
    ...canvasProps,
    children: fallbackContent
  });
}
const Chart = /* @__PURE__ */ reactExports.forwardRef(ChartComponent);
function createTypedChart(type, registerables) {
  Chart$1.register(registerables);
  return /* @__PURE__ */ reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chart, {
    ...props,
    ref,
    type
  }));
}
const Bar = /* @__PURE__ */ createTypedChart("bar", BarController);
const Doughnut = /* @__PURE__ */ createTypedChart("doughnut", DoughnutController);
export {
  Bar as B,
  Doughnut as D
};
