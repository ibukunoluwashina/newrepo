-- Inserting tony stark record to the account table
INSERT INTO public.account
    (account_firstname, account_lastname, account_email, account_password)
VALUES
    ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
    

-- Modifying the Tony Stark record to change the account_type to "Admin".
UPDATE public.account SET account_type = 'Admin' WHERE account_id=2;

-- Delete the Tony Stark record from the database.
DELETE FROM public.account WHERE account_id = 2;

-- Modifying the "GM Hummer" record to read "a huge interior" rather than "small interiors" 
UPDATE 
	public.inventory
SET
	inv_description = REPLACE (inv_description,'small interiors','a huge interior')
WHERE 
	inv_id = 10

-- Using an inner join
SELECT inv_make, inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


-- Updating all records in the inventory table 
UPDATE public.inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')