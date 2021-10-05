-- Temporary files used in conjunction with sequelizer to create the initial database, any questions contact Hiwot
-- Eventually will be removed

INSERT INTO "FieldReviews" ("reviewLocation", "reviewStartDate", "reviewCompleteDate", "mapNotes", "fieldPicturesMeta", "priority", "status", "notes", "createdAt", "updatedAt", "officersId", "tripRequestsId", "adaPathwaysId" )
Values ('origin', '2020-08-02', '2020-08-02', 'survey 5 blocks', array['{"pictureId":"1", "barrier":"curbcut"}', '{"pictureId":"2", "barrier":"zerba cross"}']::json[], 'Medium', 'under_review', 'test note', now(), now(), 2, 1, 1 );
select * from "FieldReviews"

INSERT INTO "DesktopReviews" ("reviewLocation", "reviewStartDate", "reviewCompleteDate", "priority", "status", "notes", "createdAt", "updatedAt", "officersId", "tripRequestsId", "adaPathwaysId" )
Values ('origin', '2020-08-02', '2020-08-02', 'Medium', 'under_review', 'test note', now(), now(), 2, 2, 2 );
select * from "DesktopReviews"

INSERT INTO "ADAPathways" ("pathwayItinerary", "itineraryADALegs", "pathwayCompleteDate", "priority", "status", "notes", "createdAt", "updatedAt", "officersId", "tripRequestsId" )
values ('{"legs":1, "mode":"walk"}', array['{"legs":"1", "mode":"walk"}', '{"legs":"1", "mode":"bus"}']::json[], '2020-08-02', 'Medium', 'under_review', 'test note', now(), now(), '1', '1');
select * from "ADAPathways";

INSERT INTO "ADAPathways" ("id", "selectedItinNumber", "pathwayCompleteDate", "priority", "status", "notes", "createdAt", "updatedAt" )
values ('7','2', '2020-08-02', 'Medium', 'under_review', 'test note', now(), now());
select * from "ADAPathways";


<<<<<<< HEAD
INSERT INTO "Officers" ("firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officeRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt")
SELECT 'John', 'Wick',10001, 'jwick@mvt.org', '', 'Sr. officer', 'admin', 'Continental', '{10000, 20000, 30000}', 'true', now(), now() ;

INSERT INTO "Officers" ("firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officeRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt")
SELECT 'Ellen', 'Ripley', 10002, 'eripley@mvt.org', '', 'officer', 'reviewer', 'MVT', '{40000, 50000}', 'true', now(), now() ;

INSERT INTO "Officers" ("firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officeRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt")
SELECT 'David' , 'Watson', 10003, 'dwatson@mvt.org', '', 'Trainee', 'admin', 'Metro', '{60000, 70000, 80000}', 'true', now(), now() ;
=======
INSERT INTO "Officers" ("firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officerRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt")
SELECT 'John', 'Wick',10001, 'jwick@mvt.org', '', 'Sr. officer', 'supervisor', 'Continental', '{10000, 20000, 30000}', 'true', now(), now() ;

INSERT INTO "Officers" ("firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officerRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt")
SELECT 'Ellen', 'Ripley', 10002, 'eripley@mvt.org', '', 'officer', 'Team Member', 'MVT', '{40000, 50000}', 'true', now(), now() ;

INSERT INTO "Officers" ("firstName", "lastName", "idNumber", "eMail", "cognitoSub", "officerTitle", "officerRoles", "agency", "zoneZips", "active", "createdAt", "updatedAt")
SELECT 'David' , 'Watson', 10003, 'dwatson@mvt.org', '', 'Trainee', 'Team Member', 'Metro', '{60000, 70000, 80000}', 'true', now(), now() ;
>>>>>>> eb33ceeeb25cf9e81e42413612d57286e6f546b7

select * from "Officers";


INSERT INTO "TripRequests"("pName", "pAddr","pZip" "pCity", "dName", "dAddr", "dZip", "dCity", "door", "DateAdded", "daysOfWeekRequested", "timeRequested", "priority", "status", "notes", "clientsId", "officersId", "createdAt", "updatedAt")
Values ('Apt 1', '100 canal st', '20000', 'Seattle', 'Walmart', '200 15th st', '30000', 'Seattle', 'yes', '2020-07-26', '{"All"}', '14:00:00', 'High', 'Under Review', 'test notes2', '3', '4', now(), now() );
Values ('Safeway', '1616 canal st', '40000', 'Seattle', 'W Clinic', '190 17th st', '60000', 'Seattle', 'yes', '2020-07-26', '{"T", "W"}', '09:00', 'Medium', 'Under Review', 'test notes', '1', '2', now(), now() );

select * from "TripRequests";


INSERT INTO "Clients"(first_name, last_name, client_id, "mobility_aidsID", "createdAt", "updatedAt")
SELECT 'fname_' || seq , 'lname_' || seq , seq, (SELECT id from "Mobility_aids" WHERE id=2), now(), now() 
FROM GENERATE_SERIES(1, 2) seq;
INSERT INTO "Clients"(first_name, last_name, client_id, "mobility_aidsID", "createdAt", "updatedAt")
SELECT 'fname_' || seq , 'lname_' || seq , seq, (SELECT id from "Mobility_aids" WHERE id=3), now(), now() 
FROM GENERATE_SERIES(3, 4) seq;
INSERT INTO "Clients"(first_name, last_name, client_id, "mobility_aidsID", "createdAt", "updatedAt")
SELECT 'fname_' || seq , 'lname_' || seq , seq, (SELECT id from "Mobility_aids" WHERE id=4), now(), now() 
FROM GENERATE_SERIES(5, 6) seq;
select * from "Clients";


-- Login to psql and run the following

-- What is the result?
SELECT MAX(id) FROM "lookup_codes";

-- Then run...
-- This should be higher than the last result.
SELECT nextval(pg_get_serial_sequence('lookup_codes', 'id'));


-- If it's not higher... run this set the sequence last to your highest id. 
-- (wise to run a quick pg_dump first...)

BEGIN;
-- protect against concurrent inserts while you update the counter
LOCK TABLE "lookup_codes" IN EXCLUSIVE MODE;
-- Update the sequence
SELECT setval((pg_get_serial_sequence('lookup_codes', 'id')), COALESCE((SELECT MAX(id)+1 FROM "lookup_codes"), 1), false);
COMMIT;


/* Caution use carefully , it will delete all data from table */
/*
delete from "ADAPathways" where id = 18;

TRUNCATE TABLE "lookup_codes" RESTART IDENTITY;
TRUNCATE TABLE "Officers" RESTART IDENTITY cascade;
TRUNCATE TABLE "Settings" RESTART IDENTITY;
select * from "ADAPathways";
*/