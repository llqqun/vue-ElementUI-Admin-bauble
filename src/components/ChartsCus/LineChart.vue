<template>
  <div :class="className" :style="{height:tableHeight,width:width}" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

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
      default: '350px'
    },
    titleText: {
      type: String,
      default: '统计'
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
    };
  },
  computed: {
    tableHeight: function() {
      return document.body.offsetHeight - 400 + 'px';
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, actualData, title } = {}) {
      this.chart.setOption({
        backgroundColor: 'rgb(48, 65, 86)',
        title: {
          text: title,
          left: '50%',
          top: '10',
          textStyle: {
            color: '#fff',
            fontSize: '20'
          }
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
          boundaryGap: true,
          axisTick: {
            show: true
          },
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 100,
          bottom: 30,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            },
            type: 'cross'
          },
          padding: [5, 10]
        },
        legend: {
          textStyle: {
            color: '#fff'
          },
          orient: 'vertical',
          right: 10,
          top: 10,
          bottom: 20,
          data: ['line', 'line1', 'bar', 'male', 'female']
        },
        series: [
          {
            name: 'line',
            smooth: true,
            type: 'line',
            symbolSize: 10, // 节点大小
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: { // 线条样式
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: { // 区域填充样式
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData,
            animationDuration: 2800, // 动画时长
            animationEasing: 'quadraticOut' // 动画效果
          },
          {
            name: 'line1', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            symbolSize: 10,
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'bar',
            type: 'bar',
            barMaxWidth: '20%', // 柱条最大宽度
            barGap: '50%',
            itemStyle: {
              barBorderRadius: 0,
              color: 'rgba(252,230,48,1)'
            },
            label: {
              show: true,
              position: 'top',
              formatter(p) {
                return p.value > 0 ? p.value : '';
              }
            },
            data: [
              102,
              201,
              296,
              381,
              251,
              191,
              178,
              475,
              209,
              323,
              265,
              298
            ]
          },
          {
            name: 'male',
            type: 'bar',
            stack: 'total', // 数据堆叠
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: [
              327,
              177,
              207,
              120,
              80,
              48,
              204,
              130,
              101,
              51,
              31,
              220
            ]
          },
          {
            name: 'female',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: [
              70,
              117,
              255,
              260,
              119,
              133,
              144,
              285,
              208,
              372,
              284,
              48
            ]
          }
        ]
      });
    }
  }
};
</script>
