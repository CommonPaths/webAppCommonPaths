-- Temporary files used in conjunction with sequelizer to create the initial database, any questions contact Hiwot
-- Eventually will be removed
CREATE TABLE officer_profile (id SERIAL NOT NULL, first_name varchar(255), last_name varchar(255), id_number int4, officer_title varchar(255), officer_roles varchar(255), active bool, PRIMARY KEY (id));
CREATE TABLE trip_requests (id SERIAL NOT NULL, client_profileid int4 NOT NULL, p_name varchar(255), p_addr varchar(255), p_city varchar(255), d_name varchar(255), d_addr varchar(255), d_city varchar(255), req_date date, req_status varchar(255), PRIMARY KEY (id));
CREATE TABLE review_desktop (id SERIAL NOT NULL, trip_requestsid int4 NOT NULL, officer_profileid int4 NOT NULL, ada_routeid int4 NOT NULL, review_addr_point varchar(255), review_start_date date, review_complete_date date, review_osm_changeset_id varchar(255), review_status varchar(255), PRIMARY KEY (id));
CREATE TABLE ada_route (id SERIAL NOT NULL, trip_requestsid int4 NOT NULL, review_fieldid int4 NOT NULL, review_desktopid int4 NOT NULL, officer_profileid int4 NOT NULL, ada_route_req_addr varchar(255), ada_route_segments varchar(255), ada_route_way_id int4, ada_route_itineary varchar(255), ada_route_complete_date date, elig_cond varchar(255), ada_route_status varchar(255), PRIMARY KEY (id));
CREATE TABLE client_profile (id SERIAL NOT NULL, mobility_aidid int4 NOT NULL, first_name varchar(255), last_name varchar(255), client_id int4, cert_date date, recert_date date, dob date, address varchar(255), active bool, PRIMARY KEY (id));
CREATE TABLE mobility_aid (id SERIAL NOT NULL, mobility_aid_name varchar(255), mobility_aid_type varchar(255), mobility_aid_model varchar(255), mobility_aid_gnd_height int4, PRIMARY KEY (id));
CREATE TABLE review_field (id SERIAL NOT NULL, trip_requestsid int4 NOT NULL, officer_profileid int4 NOT NULL, ada_routeid int4 NOT NULL, review_addr_point varchar(255), review_start_date date, review_complete_date date, map_notes varchar(255), review_osm_changeset_id varchar(255), review_pictures varchar(255), review_status varchar(255), PRIMARY KEY (id));
ALTER TABLE trip_requests ADD CONSTRAINT FKtrip_reque986346 FOREIGN KEY (client_profileid) REFERENCES client_profile (id);
ALTER TABLE review_desktop ADD CONSTRAINT FKreview_des586154 FOREIGN KEY (trip_requestsid) REFERENCES trip_requests (id);
ALTER TABLE review_desktop ADD CONSTRAINT FKreview_des624810 FOREIGN KEY (officer_profileid) REFERENCES officer_profile (id);
ALTER TABLE client_profile ADD CONSTRAINT FKclient_pro11849 FOREIGN KEY (mobility_aidid) REFERENCES mobility_aid (id);
ALTER TABLE review_field ADD CONSTRAINT FKreview_fie194662 FOREIGN KEY (officer_profileid) REFERENCES officer_profile (id);
ALTER TABLE review_field ADD CONSTRAINT FKreview_fie434036 FOREIGN KEY (trip_requestsid) REFERENCES trip_requests (id);
ALTER TABLE review_desktop ADD CONSTRAINT FKreview_des544793 FOREIGN KEY (ada_routeid) REFERENCES ada_route (id);
ALTER TABLE review_field ADD CONSTRAINT FKreview_fie607324 FOREIGN KEY (ada_routeid) REFERENCES ada_route (id);
ALTER TABLE ada_route ADD CONSTRAINT FKada_route757386 FOREIGN KEY (trip_requestsid) REFERENCES trip_requests (id);
ALTER TABLE ada_route ADD CONSTRAINT FKada_route453578 FOREIGN KEY (officer_profileid) REFERENCES officer_profile (id);
