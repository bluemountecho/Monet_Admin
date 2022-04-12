import React, {useEffect, useState} from 'react'
import {
  CButton,
  CFormTextarea,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import axios from 'axios'
import {Parser} from 'html-to-react'

const htmlToReactParser = new Parser()
const baseURL = ''

const Faq = () => {
  const [faqs, setFaqs] = useState([])

  useEffect(async () => {
    var faqs = (await axios.get(baseURL + '/getfaqs')).data

    setFaqs(faqs)
  }, [])

  return (
    <>
      <CForm className="mb-3" method="post" action={baseURL + "/saveFaq"}>
        <div className="row">
          <div className="col-sm-6">
            <div className="mb-3">
              <CFormLabel htmlFor="announceTitle">Faq Title</CFormLabel>
              <CFormInput type="text" name="faq_title" id="announceTitle" required />
            </div>
            <CButton type="submit" color="primary">
              Save
            </CButton>
          </div>
          <div className="col-sm-6">
            <div className="mb-3">
              <CFormLabel htmlFor="announceDescription">Faq Description</CFormLabel>
              <CFormTextarea name="faq_description" id="announceDescription" rows="5" required ></CFormTextarea>
            </div>
          </div>
        </div>
      </CForm>
      <CTable bordered hover style={{background: 'white'}}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell width="5%" scope="col">#</CTableHeaderCell>
            <CTableHeaderCell width="30%" scope="col">Title</CTableHeaderCell>
            <CTableHeaderCell width="60%" scope="col">Description</CTableHeaderCell>
            <CTableHeaderCell width="5%" scope="col">Delete</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            faqs.map((faq, index) => {
              return <CTableRow>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{faq.faq_title}</CTableDataCell>
                {/* <CTableDataCell>{htmlToReactParser.parse(faq.faq_description.replace(/(?:\r\n|\r|\n)/g, '<br/>'))}</CTableDataCell> */}
                <CTableDataCell>{faq.faq_description.substr(0, 300)}...</CTableDataCell>
                <CTableDataCell><button className="btn btn-danger" onClick={() => {
                  if (confirm('Do you want to delete faq?')) location.href=baseURL + "/deletefaq/" + faq.faq_id }}>Delete</button></CTableDataCell>
              </CTableRow>
            })
          }
        </CTableBody>
      </CTable>
    </>
  )
}

export default Faq
