import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEnvelopeClosed } from '@coreui/icons'

const baseURL = 'https://www.mtztoken.com/api'
const VerifyCode = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCard className="p-4">
              <CCardBody>
                <CForm action={baseURL + "/verifycode"} method="post">
                  <h1>Verify Code</h1>
                  <p className="text-medium-emphasis">Please check your email and paste verify code to following input. If you haven't got verify code yet, please wait.</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Verify Code" name="verifyCode" required="required" />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={12}>
                      <CButton type="submit" color="primary" className="px-4">
                        Verify
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default VerifyCode
