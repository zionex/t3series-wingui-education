import { Chart as ChartJS, BarController } from 'chart.js';

const gGap = 3;
const gBarHeight = 10;
/**
 * Equalizer Bar 챠트
 * type: equalizerBarChart
 * 
 * 예)
 * const chartData = {
  labels: labels,
  datasets: [
    {
      type: 'equalizerBarChart',
      label: 'Dataset 1',
      //borderColor: 'rgb(255, 99, 132)',
      backgroundColor: '#fe777b',
      data: [100,200,300,23,322,34,44],
    },
    {
        type: 'equalizerBarChart',
        label: 'Dataset 2',
        //borderColor: 'rgb(255, 99, 132)',
        backgroundColor: '#e9d333',
        data: [20,202,30,223,322,324,434],
      },
  ],
  };

  const options= {
    // line gap가 Line 높이값을 줄 수 있다.
    equalizerBarChart: {
      lineGap: 3,
      lineHeight: 10,
    }
  }
 */

class EqualizerBarChart extends BarController {

  draw() {

    //super.draw(arguments);
    const meta = this.getMeta();

    const ctx = this.chart.ctx;
    //const chartArea = this.chart.chartArea;
    const config = this.chart.config;

    let gap = gGap
    let barHeight = gBarHeight

    if (config && config._config && config._config.options) {
      if (config._config.options.stackedBarChart) {
        const { lineGap, lineHeight } = config._config.options.stackedBarChart
        gap = lineGap != undefined ? lineGap : gGap
        barHeight = lineHeight != undefined ? lineHeight : gBarHeight
      }
    }
    ctx.save();

    meta.data.forEach(pt0 => {
      const { x, y, width, height } = pt0.getProps(['x', 'y', 'width', 'height']);
      const { backgroundColor, borderColor, borderWidth } = pt0.options

      let totHeight = barHeight + gap;

      let yy = y + height
      let remain = height % totHeight;

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.fillStyle = backgroundColor;

      let i = yy

      for (i = yy; i >= y;) {

        ctx.fillRect(x - width / 2, i + gap, width, barHeight);
        i = i - totHeight
      }

      ctx.fillRect(x - width / 2, y, width, remain);
    })
    ctx.restore();
  }
};
EqualizerBarChart.id = 'equalizerBarChart';
EqualizerBarChart.defaults = BarController.defaults;

export default EqualizerBarChart;