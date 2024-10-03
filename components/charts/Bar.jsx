import Chart, { Props } from "react-apexcharts";
let aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export const Bar = ({categories, series}) => {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Invoices'
      },
      labels: {
        formatter: function (value) {
          return aud.format(value).replace(/\.00/, '')
        }
      }
    },

    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands"
        }
      }
    }
  };


  return (
    <Chart options={options} series={series} type="bar" width={500} height={320} />
  )
}