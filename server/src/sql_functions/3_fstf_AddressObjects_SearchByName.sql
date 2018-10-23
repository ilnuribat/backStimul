--ROLLBACK TRANSACTION;
BEGIN
  TRANSACTION;
  DROP FUNCTION IF EXISTS fstf_AddressObjects_SearchByName (a_FormalName VARCHAR(150), a_ShortName VARCHAR(20), a_ParentFormalName VARCHAR(150), a_ParentShortName VARCHAR(20), a_GrandParentFormalName VARCHAR(150), a_GrandParentShortName VARCHAR(20));
    /************************************************************************/
    /* Возвращает результат поиска в списке адресообразующих элементов ФИАС */
    /* по их названию и типу	 		                        */
    /***********************************************************************/
    CREATE OR REPLACE FUNCTION fstf_AddressObjects_SearchByName (
			a_FormalName VARCHAR(150),
			/* Оптимизированное для поиска наименование */
			/* адресообразующего элемента*/
			a_ShortName VARCHAR(20) DEFAULT NULL,
			/* Сокращенное наименование типа */
			/*адресообразующего элемента */
			a_ParentFormalName VARCHAR(150) DEFAULT NULL,
			/* Оптимизированное для поиска */
			/* наименование адресообразующего элемента*/
			a_ParentShortName VARCHAR(20) DEFAULT NULL,
			/* Сокращенное наименование типа */
			/*адресообразующего элемента */
			a_GrandParentFormalName VARCHAR(150) DEFAULT NULL,
			/*Оптимизированное для поиска */
			/* наименование адресообразующего элемента*/
			a_GrandParentShortName VARCHAR(20) DEFAULT NULL
			/* Сокращенное наименование типа */
			/* адресообразующего элемента */
)
      RETURNS TABLE (
				rtf_AOGUID VARCHAR(36),
				rtf_AOLevel NUMERIC,
				rtf_AddressObjectsFullName VARCHAR(1000),
				rtf_ShortName VARCHAR(20),
				rtf_FormalName VARCHAR(150),
				rtf_CurrStatus NUMERIC,
				rtf_ParentShortName VARCHAR(20),
				rtf_ParentFormalName VARCHAR(150),
				rtf_GrandParentShortName VARCHAR(20),
				rtf_GrandParentFormalName VARCHAR(150)
			)
AS $BODY$
DECLARE
  c_WildChar CONSTANT VARCHAR(2) = '%';
  c_BlankChar CONSTANT VARCHAR(2) = ' ';
  v_FormalNameTemplate VARCHAR(150);
  /* Шаблон для поиска наименования */
  /* адресообразующего элемента*/
  v_ShortNameTemplate VARCHAR(20);
  /* Шаблон для поиска типа */
  /* адресообразующего элемента */
  v_ParentFormalNameTemplate VARCHAR(150);
  /* Шаблон для поиска наименования */
  /* родительского адресообразующего элемента*/
  v_ParentShortNameTemplate VARCHAR(20);
  /* Шаблон для поиска типа родительского */
  /* адресообразующего элемента */
  v_GrandParentFormalNameTemplate VARCHAR(150);
  /* Шаблон для поиска */
  /* наименования родительского адресообразующего элемента*/
  v_GrandParentShortNameTemplate VARCHAR(20);
  /* Шаблон для поиска типа */
  /* родительского адресообразующего элемента */
  --************************************************************
  --************************************************************
BEGIN
  v_ShortNameTemplate := UPPER(COALESCE(c_WildChar || REPLACE(TRIM(a_ShortName), c_BlankChar, c_WildChar) || c_WildChar, c_WildChar));
  v_FormalNameTemplate := UPPER(c_WildChar || REPLACE(TRIM(a_FormalName), c_BlankChar, c_WildChar) || c_WildChar);
  IF a_ParentFormalName IS NULL AND a_ParentShortName IS NULL AND a_GrandParentFormalName IS NULL AND a_GrandParentShortName IS NULL THEN
    RETURN QUERY
    SELECT
      cfa.AOGUID,
      cfa.AOLevel,
      fsfn_AddressObjects_TreeActualName (cfa.AOGUID),
      cfa.ShortName,
      cfa.FORMALNAME,
      cfa.currstatus,
      NULL::VARCHAR,
      NULL::VARCHAR,
      NULL::VARCHAR,
      NULL::VARCHAR
    FROM
      "fias_AddressObjects" cfa
    WHERE
      cfa.currstatus = CASE WHEN 0 < ALL (
          SELECT
            iao.currstatus
          FROM
            "fias_AddressObjects" iao
          WHERE
            cfa.aoguid = iao.aoguid) THEN
          (
            SELECT
              MAX(iao.currstatus)
            FROM
              "fias_AddressObjects" iao
            WHERE
              cfa.aoguid = iao.aoguid)
          ELSE
            0
    	END
    AND UPPER(cfa.FORMALNAME) LIKE v_FormalNameTemplate
    AND UPPER(cfa.ShortName) LIKE v_ShortNameTemplate
  ORDER BY
    cfa.AOLevel,
    cfa.ShortName,
    cfa.FORMALNAME;
  ELSIF a_ParentFormalName IS NOT NULL
    AND a_GrandParentFormalName IS NULL
    AND a_GrandParentShortName IS NULL THEN
    	v_ParentShortNameTemplate := UPPER(COALESCE(c_WildChar || REPLACE(TRIM(a_ParentShortName), c_BlankChar, c_WildChar) || c_WildChar, c_WildChar));
    	v_ParentFormalNameTemplate := UPPER(c_WildChar || REPLACE(TRIM(a_ParentFormalName), c_BlankChar, c_WildChar) || c_WildChar);
    	v_FormalNameTemplate := COALESCE(v_FormalNameTemplate, c_WildChar);
    RETURN QUERY
    SELECT
      cfa.AOGUID,
      cfa.AOLevel,
      fsfn_AddressObjects_TreeActualName (cfa.AOGUID),
      cfa.ShortName,
      cfa.FORMALNAME,
      cfa.currstatus,
      pfa.ShortName,
      pfa.FORMALNAME,
      NULL::VARCHAR,
      NULL::VARCHAR
    FROM
      "fias_AddressObjects" pfa
    INNER JOIN "fias_AddressObjects" cfa ON pfa.AOGUID = cfa.ParentGUID
    WHERE
      cfa.currstatus = CASE WHEN 0 < ALL (
          SELECT
            iao.currstatus
          FROM
            "fias_AddressObjects" iao
          WHERE
            cfa.aoguid = iao.aoguid) THEN
          (
            SELECT
              MAX(iao.currstatus)
            FROM
              "fias_AddressObjects" iao
            WHERE
              cfa.aoguid = iao.aoguid)
          ELSE
            0
    END
    AND pfa.currstatus = CASE WHEN 0 < ALL (
        SELECT
          iao.currstatus
        FROM
          "fias_AddressObjects" iao
        WHERE
          pfa.aoguid = iao.aoguid) THEN
        (
          SELECT
            MAX(iao.currstatus)
          FROM
            "fias_AddressObjects" iao
          WHERE
            pfa.aoguid = iao.aoguid)
        ELSE
          0
  END
  AND UPPER(pfa.FORMALNAME)
  LIKE v_ParentFormalNameTemplate
  AND UPPER(pfa.ShortName)
  LIKE v_ParentShortNameTemplate
  AND UPPER(cfa.FORMALNAME)
  LIKE v_FormalNameTemplate
  AND UPPER(cfa.ShortName)
  LIKE v_ShortNameTemplate
ORDER BY
  pfa.ShortName,
  pfa.FORMALNAME,
  cfa.AOLevel,
  cfa.ShortName,
  cfa.FORMALNAME;
  ELSE
    v_GrandParentShortNameTemplate := UPPER(COALESCE(c_WildChar || REPLACE(TRIM(a_GrandParentShortName), c_BlankChar, c_WildChar) || c_WildChar, c_WildChar));
    v_GrandParentFormalNameTemplate := UPPER(c_WildChar || REPLACE(TRIM(a_GrandParentFormalName), c_BlankChar, c_WildChar) || c_WildChar);
    v_ParentShortNameTemplate := COALESCE(UPPER(COALESCE(c_WildChar || REPLACE(TRIM(a_ParentShortName), c_BlankChar, c_WildChar) || c_WildChar, c_WildChar)), c_WildChar);
    v_ParentFormalNameTemplate := COALESCE(UPPER(c_WildChar || REPLACE(TRIM(a_ParentFormalName), c_BlankChar, c_WildChar) || c_WildChar), c_WildChar);
    v_FormalNameTemplate := COALESCE(v_FormalNameTemplate, c_WildChar);
    RETURN QUERY
    SELECT
      cfa.AOGUID,
      cfa.AOLevel,
      fsfn_AddressObjects_TreeActualName (cfa.AOGUID),
      cfa.ShortName,
      cfa.FORMALNAME,
      cfa.currstatus,
      pfa.ShortName,
      pfa.FORMALNAME,
      gpfa.ShortName,
      gpfa.FORMALNAME
    FROM
      "fias_AddressObjects" gpfa
    INNER JOIN "fias_AddressObjects" pfa ON gpfa.AOGUID = pfa.ParentGUID
    INNER JOIN "fias_AddressObjects" cfa ON pfa.AOGUID = cfa.ParentGUID
    WHERE
      cfa.currstatus = CASE WHEN 0 < ALL (
          SELECT
            iao.currstatus
          FROM
            "fias_AddressObjects" iao
          WHERE
            cfa.aoguid = iao.aoguid) THEN
          (
            SELECT
              MAX(iao.currstatus)
            FROM
              "fias_AddressObjects" iao
            WHERE
              cfa.aoguid = iao.aoguid)
          ELSE
            0
    END
    AND pfa.currstatus = CASE WHEN 0 < ALL (
        SELECT
          iao.currstatus
        FROM
          "fias_AddressObjects" iao
        WHERE
          pfa.aoguid = iao.aoguid) THEN
        (
          SELECT
            MAX(iao.currstatus)
          FROM
            "fias_AddressObjects" iao
          WHERE
            pfa.aoguid = iao.aoguid)
        ELSE
          0
  END
  AND gpfa.currstatus = CASE WHEN 0 < ALL (
      SELECT
        iao.currstatus
      FROM
        "fias_AddressObjects" iao
      WHERE
        gpfa.aoguid = iao.aoguid) THEN
      (
        SELECT
          MAX(iao.currstatus)
        FROM
          "fias_AddressObjects" iao
        WHERE
          gpfa.aoguid = iao.aoguid)
      ELSE
        0
END
AND UPPER(gpfa.FORMALNAME)
LIKE v_GrandParentFormalNameTemplate
AND UPPER(gpfa.ShortName)
LIKE v_GrandParentShortNameTemplate
AND UPPER(pfa.FORMALNAME)
LIKE v_ParentFormalNameTemplate
AND UPPER(pfa.ShortName)
LIKE v_ParentShortNameTemplate
AND UPPER(cfa.FORMALNAME)
LIKE v_FormalNameTemplate
AND UPPER(cfa.ShortName)
LIKE v_ShortNameTemplate
ORDER BY
  gpfa.ShortName,
  gpfa.FORMALNAME,
  pfa.ShortName,
  pfa.FORMALNAME,
  cfa.AOLevel,
  cfa.ShortName,
  cfa.FORMALNAME;
  END IF;
END;
$BODY$
LANGUAGE plpgsql;

COMMENT ON FUNCTION fstf_AddressObjects_SearchByName (a_FormalName VARCHAR(150), a_ShortName VARCHAR(20), a_ParentFormalName VARCHAR(150), a_ParentShortName VARCHAR(20), a_GrandParentFormalName VARCHAR(150), a_GrandParentShortName VARCHAR(20))
IS 'Возвращает результат поиска в списке адресообразующих элементов ФИАС по их названию и типу';


COMMIT TRANSACTION;
