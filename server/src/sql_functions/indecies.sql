CREATE INDEX XIE1fias_AddressObjects ON "fias_AddressObjects"(AOGUID);
CREATE INDEX XIE2fias_AddressObjects ON "fias_AddressObjects"(PARENTGUID);
CREATE UNIQUE INDEX XAK1fias_AddressObjects ON "fias_AddressObjects"(CODE);
CREATE INDEX XIE3fias_AddressObjects ON "fias_AddressObjects"(REGIONCODE,AUTOCODE,AREACODE,CITYCODE,CTARCODE,PLACECODE,STREETCODE,EXTRCODE,SEXTCODE);