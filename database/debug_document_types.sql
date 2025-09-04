-- Debug the dim_document_type table
SELECT 
  doc_type_id,
  doc_type_name,
  display_order,
  is_active,
  requires_signature,
  retention_days,
  created_date
FROM dim_document_type 
ORDER BY doc_type_id;

-- Check if is_active is causing the issue
SELECT COUNT(*) as total_records,
       COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM dim_document_type;
