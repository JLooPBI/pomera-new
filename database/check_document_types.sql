-- Check if dim_document_type table has data
SELECT * FROM dim_document_type ORDER BY doc_type_id;

-- If no data, insert the sample data
INSERT INTO dim_document_type (doc_type_name, display_order, requires_signature, retention_days) VALUES
('W-9', 1, true, 2555),
('Contract', 2, true, 2555),
('Job Description', 3, false, 1095),
('NDA', 4, true, 1825)
ON CONFLICT (doc_type_name) DO NOTHING;

-- Verify the data was inserted
SELECT * FROM dim_document_type ORDER BY doc_type_id;
