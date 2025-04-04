import React from 'react'
import { BarChart as BaseBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CustomTick, CustomTooltip } from './parts'
import CustomLegend from './parts/CustomLegend'
import s from './style.module.scss'
import { IStatisticsData } from './types'

interface IBarChartProps {
  data: IStatisticsData
  height?: string
}

const BarChart = ({ data, height = '424px' }: IBarChartProps) => {
  if (!data) return null

  const statistics = data?.formattedStatistics

  return (
    <div className={s.chart}>
      <CustomLegend data={data} />
      <div style={{ height }} className={s.chart__graph}>
        <ResponsiveContainer width='100%' height='100%'>
          <BaseBarChart
            width={500}
            height={300}
            data={statistics}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray='5' horizontal={false} />
            <YAxis style={{ fontSize: '13px', fontWeight: 500, color: '#5E6774' }} tickLine={false} tickMargin={16} />
            <Tooltip content={<CustomTooltip active={false} payload={[]} label='' />} />
            <Bar radius={[4, 4, 0, 0]} xAxisId='one' dataKey='secondLabel' fill='#BDDCFF' />
            <XAxis
              style={{ fontSize: '13px', fontWeight: 500 }}
              tick={CustomTick}
              tickLine={false}
              tickMargin={16}
              dataKey='date'
              xAxisId='one'
            />
            <Bar radius={[4, 4, 0, 0]} xAxisId='two' dataKey='firstLabel' fill='#3693F8' />
            <XAxis xAxisId='two' hide />
          </BaseBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
export default BarChart
