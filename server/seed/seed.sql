INSERT INTO users (name, email, role) VALUES
  ('Alex Morgan', 'alex.morgan@example.com', 'technician'),
  ('Jordan Lee', 'jordan.lee@example.com', 'operator')
ON CONFLICT (email) DO NOTHING;

INSERT INTO sites (name, address, status, contact_name, contact_phone) VALUES
  ('Northwind Warehouse', '12 Industrial Way', 'active', 'Priya Shah', '555-0101'),
  ('Harbour Office', '48 Harbour Road', 'active', 'Daniel Green', '555-0102'),
  ('Westfield Depot', '9 Depot Lane', 'completed', 'Maya Patel', '555-0103')
ON CONFLICT DO NOTHING;

INSERT INTO installations (site_id, assigned_to, status, scheduled_date, completed_date, notes)
SELECT s.id, u.id, 'completed', CURRENT_DATE - 7, CURRENT_DATE - 3, 'Initial installation completed.'
FROM sites s CROSS JOIN users u
WHERE s.name = 'Northwind Warehouse' AND u.email = 'alex.morgan@example.com'
  AND NOT EXISTS (SELECT 1 FROM installations i WHERE i.site_id = s.id);
