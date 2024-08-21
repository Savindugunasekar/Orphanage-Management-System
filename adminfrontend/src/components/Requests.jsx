import { useState, useEffect } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { RequestTable } from "./RequestTable"
import useAuth from "../hooks/useAuth"
import { ChildPreview } from "./ChildPreview"
import toast from "react-hot-toast"

export const Requests = ({ type }) => {
    const axiosPrivate = useAxiosPrivate()
    const [requests, setRequests] = useState([])
    // const { auth } = useAuth();
    // const [role, setRole] = useState(auth?.role)
    const [visibility, setVisibility] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)


    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                const response = await axiosPrivate.get('/request/sent')
                setRequests(response.data.requests)
            } catch (error) {
                toast.error('Failed to fetch requests')
            }
        }

        const fetchReceivedRequests = async () => {
            try {
                const response = await axiosPrivate.get('/request/received')
                setRequests(response.data.requests)
            } catch (error) {
                console.error('Failed to fetch requests')
            }
        }
        if (type === 'sent') fetchSentRequests()
        else if (type === 'received') fetchReceivedRequests()

    }, [type])

    return (
        <div>
            <div className="mx-10">
                <RequestTable
                    requests={requests}
                    setVisibility={setVisibility}
                    setSelectedRequest={setSelectedRequest}
                    selectedRequest={selectedRequest} />
            </div>
            {visibility ?
                <ChildPreview
                    requests={requests}
                    setRequests={setRequests}
                    setVisibility={setVisibility}
                    requestId={selectedRequest.requestid} />
                : null}
        </div>
    )
}
