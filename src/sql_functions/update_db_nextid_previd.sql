UPDATE "fias_AddressObjects" ao SET NEXTID=NULL
WHERE ao.NEXTID IS NOT NULL AND NOT EXISTS(SELECT * FROM "fias_AddressObjects" nao  WHERE nao.AOID=ao.NEXTID);

UPDATE "fias_AddressObjects" ao SET PREVID=NULL	
WHERE ao.PREVID IS NOT NULL AND NOT EXISTS(SELECT * FROM "fias_AddressObjects" pao  WHERE pao.AOID=ao.PREVID);