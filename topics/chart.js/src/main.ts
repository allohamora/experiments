import {
  Chart,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
  ChartConfiguration,
} from 'chart.js';
import './style.css';

Chart.register(LineController, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

const app = document.querySelector('#app')!;
const chartBlock = document.createElement('div');
chartBlock.classList.add('chart-block');

const canvas = document.createElement('canvas')!;
canvas.width = 800;
canvas.height = 400;

const ctx = canvas.getContext('2d')!;
chartBlock.append(canvas);
app.append(chartBlock);
const data = [-1, 3, 2, 1, 3, 2].map((num) => num * 100);

const POINT_RADIUS = 2; // chart.js incorrectly expands point with 0 radius
const HOVER_POINT_RADIUS = 12;
const LAST_POINT_RADIUS = HOVER_POINT_RADIUS;

const getLastRestPointOptions = <T>({
  data,
  lastValue,
  restValues,
}: {
  data: number[];
  lastValue: T;
  restValues: T;
}) => {
  return data.slice(0, data.length - 1).map((item, i, arr) => (i === arr.length - 1 ? lastValue : restValues));
};

const desktopOptions: ChartConfiguration<'line'>['options'] = {
  responsive: true,
  elements: {
    line: {
      borderWidth: 5,
      cubicInterpolationMode: 'monotone',
      fill: 'start',
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, .2)',
    },
    point: {
      borderWidth: 2,
      hoverRadius: HOVER_POINT_RADIUS,
      hitRadius: 30,
      backgroundColor: 'rgba(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192)',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      caretSize: 0,
      caretPadding: 0,
      cornerRadius: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      bodySpacing: 0,
      titleSpacing: 0,
      padding: 0,
      titleColor: 'black',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      titleMarginBottom: -6,
      xAlign: 'center',
      yAlign: 'bottom',
      titleFont: {
        size: 10,
        weight: 'bold',
      },
      callbacks: {
        title: (items) => items[0].formattedValue,
        label: () => '',
      },
    },
  },
  scales: {
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
      grace: 5,
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 13,
          weight: 'bold',
        },
      },
    },
  },
};

const mobileOptions: ChartConfiguration<'line'>['options'] = {
  ...desktopOptions,
  scales: {
    ...desktopOptions.scales,
    x: {
      ...desktopOptions.scales!.x,
      ticks: {
        ...desktopOptions.scales!.x?.ticks,
        display: false,
      },
    },
  },
};

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['16:00', '17:00', '18:00', '19:00', '20:00'],
    datasets: [
      {
        label: '1',
        data,
        pointRadius: getLastRestPointOptions({ data, lastValue: LAST_POINT_RADIUS, restValues: POINT_RADIUS }),
      },
    ],
  },
  options: desktopOptions,
});

const toDesktop = (chart: Chart) => {
  chart.options = desktopOptions;
};

const toMobile = (chart: Chart) => {
  chart.options = mobileOptions;
};

const chartResizeHandler = () => {
  if (window.matchMedia('(max-width: 550px)').matches) {
    toMobile(chart);
  } else {
    toDesktop(chart);
  }

  chart.update();
  chart.resize();
};

window.addEventListener('resize', chartResizeHandler);
chartResizeHandler();
