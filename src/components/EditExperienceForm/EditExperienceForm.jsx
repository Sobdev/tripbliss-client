import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import GeoForm from "../GeoForm/GeoForm";
import experiencesServices from '../../services/experiences.services'

const EditExpForm = () => {
    const initialState = {
        country: "",
        hotel: "",
        places: "",
        package: "",
        location: {
            type: "Point",
            coordinates: []
        },
        geocode: ""
    }
    const { experienceId } = useParams()
    const navigate = useNavigate()
    const [expData, setExpData] = useState(initialState)

    useEffect(() => {
        loadFormData()
    }, [])

    const loadFormData = () => {
        experiencesServices
            .getOneExperience(experienceId)
            .then(({ data }) => setExpData(data))
            .catch(err => console.log(err))
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setExpData({ ...expData, [name]: value })
    }

    const handleLocationSelect = (location) => {
        setExpData({
            ...expData,
            location: {
                type: "Point",
                coordinates: [location.longitude, location.latitude]
            },
            geocode: location.address
        })
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        experiencesServices
            .editExperience(experienceId, expData)
            .then(() => navigate(`/experiences/all`))
            .catch(err => console.log(err))
    }

    const handleCancel = () => {
        setExpData(initialState)
    }

    const handleDelete = () => {
        experiencesServices
            .deleteExperience(experienceId)
            .then(() => navigate('/'))
            .catch(err => console.log(err))
    }

    return (
        <div className="editExpForm mt-5">
            <Form onSubmit={handleFormSubmit} className="mt-4">
                <Form.Group className="mb-3" controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        name="country"
                        value={expData.country}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="hotel">
                    <Form.Label>Hotel</Form.Label>
                    <Form.Control
                        type="text"
                        name="hotel"
                        value={expData.hotel}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="places">
                    <Form.Label>Places</Form.Label>
                    <Form.Control
                        type="text"
                        name="places"
                        value={expData.places}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="package">
                    <Form.Label>Package</Form.Label>
                    <Form.Control
                        type="text"
                        name="package"
                        value={expData.package}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <GeoForm onLocationSelect={handleLocationSelect} initialAddress={expData.geocode} />

                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="geocode"
                        value={expData.geocode}
                        readOnly
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="latitude">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                        type="number"
                        name="latitude"
                        value={expData.location.coordinates[1]}
                        readOnly
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="longitude">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                        type="number"
                        name="longitude"
                        value={expData.location.coordinates[0]}
                        readOnly
                    />
                </Form.Group>
                <hr />
                <Button variant="dark" type="submit" className="w-100 mb-4">
                    Apply Changes
                </Button>
                <Button variant="secondary" type="button" className="w-100 mb-4" onClick={handleCancel}>
                    Clear
                </Button>
                <Button variant="danger" type="button" className="w-100" onClick={handleDelete}>
                    Delete
                </Button>
            </Form>
        </div>
    )
}

export default EditExpForm
