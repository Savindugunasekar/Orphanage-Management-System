import React, { useState, useEffect } from 'react';
import BeforeApply from './BeforeApply';
import UserApplicationList from './UserApplicationList';

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import FormApproved from './FormApproved';
import FormPending from './FormPending'
import FormRejected from './FormRejected';
import CasePending from './CasePending';
import CaseOngoing from './CaseOngoing';
import Loading from '../Loading';
import ChatBot from '../ChatBot';
import CaseClosed from './CaseClosed';

const UserDashboard = () => {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const [showModal, setShowModal] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)

    /*
    states
    0 - haven't applied yet
    1 - filled the application and waiting for approval
    2 - application approved
    3 - application rejected
    4 - child is selected
    5 - case is created(social worker assigned)
    6 - case is closed
     */

    const [currentState, setCurrentState] = useState(-1)
    const [applicationList, setApplicationList] = useState([])
    const [approvedApplications, setApprovedApplications] = useState([])
    const [cases, setCases] = useState([]);
    const [caseDetails, setCaseDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    //phase of the case
    const [currentPhase, setCurrentPhase] = useState(1)


    const renderPage = () => {
        switch (currentState) {
            case 0:
                return <BeforeApply />
            case 1:
                return <FormPending />
            case 2:
                return <FormApproved application={applicationList[applicationList.length - 1]} setCurrentState={setCurrentState} />
            case 3:
                return <FormRejected />
            case 4:
                return <CasePending />
            case 5:
                return <CaseOngoing caseDetails={caseDetails} currentPhase={currentPhase} setCurrentState={setCurrentState} />
            case 6:
                return <CaseClosed setCurrentState={setCurrentState} caseDetails={caseDetails} />
            default:
                return null;
        }
    }

    const getCase = async (caseId) => {
        try {
            const response = await axiosPrivate.get(`/case/byId?caseid=${caseId}`);
            setCaseDetails(response.data);
            if (response.data.phase3 === 'Completed') setCurrentState(5);
            else {
                if (response.data.phase2 === 'Completed') setCurrentPhase(3)
                else if (response.data.phase1 === 'Completed') setCurrentPhase(2)
                setCurrentState(5)
            }
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch case:", error);
        }
    };


    const findState = async () => {
        //get cases
        
        const casesResponse = await axiosPrivate.get(`/case/byUser`);
        
        setCases(casesResponse.data.userCases);
        console.log(cases)
        if (casesResponse.data.userCases != 0) {
            //get case details
            await getCase(casesResponse.data.userCases[casesResponse.data.userCases.length - 1].caseid)
        }
        else {
            //get approved applications
            const approvedResponse = await axiosPrivate.get(`/application/approve/${auth.userId}`)
            setApprovedApplications(approvedResponse.data.approvedList)
            if (approvedResponse.data.approvedList.length != 0) {
                setCurrentState(4)
            }
            else {
                //get all applications
                const applicationsResponse = await axiosPrivate.get('/application')
                const filteredApplicationList = applicationsResponse.data.applicationList.filter((application) => application.userid == auth.userId)
                setApplicationList(filteredApplicationList)
                if (filteredApplicationList != 0) {
                    if (filteredApplicationList[filteredApplicationList.length - 1].status === 'Rejected') {
                        setCurrentState(3)
                    }
                    else if (filteredApplicationList[filteredApplicationList.length - 1].status === 'Accepted') {
                        setCurrentState(2)
                    }
                    else { setCurrentState(1) }
                }
                else setCurrentState(0)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        findState()
    }, [])

    return (
        <div className='m-2 mt-20'>
            {loading && <Loading />}
            {!loading && renderPage()}

            <ChatBot />
        </div>
    );
}

export default UserDashboard;
