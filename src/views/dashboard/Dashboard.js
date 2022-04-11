import React from 'react'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CFormRange,
} from '@coreui/react'
import { CChartLine, CChartDoughnut } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Total Earn', value: '$ 29.703', percent: 40, color: 'success' },
    { title: 'Total Mint', value: '$ 24.093', percent: 20, color: 'info' },
    { title: 'Bet Earn', value: '$ 78.706', percent: 60, color: 'warning' },
    { title: 'Tournaments Earn', value: '$ 22.123', percent: 80, color: 'danger' },
  ]

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Monthly Income
              </h4>
              <div className="small text-medium-emphasis">January - July 2021</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: 'My Second dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-success'),
                  pointHoverBackgroundColor: getStyle('--cui-success'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: 'My Third dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: [65, 65, 65, 65, 65, 65, 65],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({item.percent}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>Monthly Earn</CCardHeader>
        <CCardBody>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'Monthly Earn',
                  backgroundColor: 'rgba(151, 187, 205, 0.2)',
                  borderColor: 'rgba(151, 187, 205, 1)',
                  pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                  pointBorderColor: '#fff',
                  data: [
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                  ],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(50 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>
      <CRow>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#4ac18e'],
                      data: [40, 60],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 green-range" defaultValue="60" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#4ac18e', border: '1px solid #4ac18e' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Mint</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#ffbb44'],
                      data: [30, 70],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 yellow-range" defaultValue="70" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#ffbb44', border: '1px solid #ffbb44' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Betting Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#8d6e63'],
                      data: [80, 20],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 brown-range" defaultValue="20" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#8d6e63', border: '1px solid #8d6e63' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Tournaments Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Tournaments Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#90a4ae'],
                      data: [90, 10],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 gray-range" defaultValue="10" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#90a4ae', border: '1px solid #90a4ae' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
