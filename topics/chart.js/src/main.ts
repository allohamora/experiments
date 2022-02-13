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

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['16:00', '17:00', '18:00', '19:00', '20:00'],
    datasets: [
      {
        label: '1',
        data,
        cubicInterpolationMode: 'monotone',
        fill: 'start',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, .2)',
        pointBackgroundColor: 'rgba(75, 192, 192, .2)',
        pointBorderWidth: 5,
      },
    ],
  },
  options: {
    responsive: true,
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
        titleMarginBottom: 5,
        titleSpacing: 0,
        padding: 0,
        titleColor: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        xAlign: 'center',
        yAlign: 'bottom',
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
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  },
});
