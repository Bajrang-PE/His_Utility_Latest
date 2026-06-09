import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";


const GraphGalleryModal = ({
    show,
    onHide,
    title = "Select Graph",
    graphs = [],
    selected = [],
    multiple = false,
    onApply
}) => {

    const [localSelection, setLocalSelection] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (multiple) {
            setLocalSelection(Array.isArray(selected) ? selected : []);
        } else {
            setLocalSelection(selected ? [selected] : []);
        }
    }, [selected, multiple, show]);

    const handleSelect = (graphValue) => {

        if (multiple) {
            setLocalSelection(prev =>
                prev.includes(graphValue)
                    ? prev.filter(item => item !== graphValue)
                    : [...prev, graphValue]
            );
        } else {
            setLocalSelection([graphValue]);
        }
    };

    const handleApply = () => {
        if (multiple) {
            onApply(localSelection);
        } else {
            onApply(localSelection[0] || "");
        }

        onHide();
    };

    const filteredGraphs = graphs.filter(graph =>
        graph.label.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="graph-modal-body">

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                    <Form.Control
                        placeholder="Search graph..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: "300px" }}
                    />

                    {/* <div className="fw-semibold">
                        Selected : {localSelection.length}
                    </div> */}
                </div>

                <div className="graph-gallery-grid">

                    {filteredGraphs.map(graph => {

                        const isSelected =
                            localSelection.includes(graph.value);

                        return (
                            <div
                                key={graph.value}
                                className={`graph-card ${isSelected ? "selected" : ""
                                    }`}
                                onClick={() => handleSelect(graph.value)}
                            >

                                <div className="graph-check">

                                    {multiple ? (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                        />
                                    ) : (
                                        <input
                                            type="radio"
                                            checked={isSelected}
                                            readOnly
                                        />
                                    )}

                                </div>

                                <img
                                    src={graph.image}
                                    alt={graph.label}
                                    className="graph-image"
                                />

                                <div className="graph-card-footer">
                                    {graph.label}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleApply}
                >
                    Apply Selection
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GraphGalleryModal;