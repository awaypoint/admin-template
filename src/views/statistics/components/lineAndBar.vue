<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '600px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: this.chartData.xAxis,
          boundaryGap: true,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            type: 'value',
            name: this.chartData.lineName,
            max: function(value) {
                return parseFloat(value.max * 1.1).toFixed(2);
            }
          },
          {
            type: 'value',
            name: this.chartData.barName,
            max: function(value) {
                return parseFloat(value.max * 1.1).toFixed(2);
            }
          }
        ],
        legend: {
          data: this.chartData.name
        },
        series: [{
          name: this.chartData.lineName,
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          smooth: true,
          type: 'line',
          data: this.chartData.lineData
        },{
          name: this.chartData.barName,
          yAxisIndex: 1,
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'insideTop'
            }
          },
          data: this.chartData.barData
        }]
      })
    }
  }
}
</script>
