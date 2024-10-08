package com.zionex.t3series.web.constant;

import java.util.HashMap;
import java.util.Map;

public interface ServiceConstants {

    /**
     * 2-Dimensional list of simple object(not collection)
     */
    String PARAMETER_KEY_TABLEDATA = "TABLEDATA";

    /**
     * map with simple object value
     */
    String PARAMETER_KEY_MAPDATA = "MAPDATA";

    /**
     * list of simple object
     */
    String PARAMETER_KEY_COLUMNS_1 = "COLUMNS_1";


    /**
     * map with simple object value
     */
    String PARAMETER_KEY_INFO = "INFO";

    String PARAMETER_KEY_RESULT_CODE = "RESULT_CODE";
    String PARAMETER_KEY_RESULT_TYPE = "RESULT_TYPE";
    String PARAMETER_KEY_RESULT_SUCCESS = "RESULT_SUCCESS";
    String PARAMETER_KEY_RESULT_MESSAGE = "RESULT_MESSAGE";
    String PARAMETER_KEY_RESULT_DATA = "RESULT_DATA";

    String PARAMETER_KEY_ITC1S_NAMES = "ITC1S_NAMES";

    String PARAMETER_KEY_MENU_CD = "menu-cd";
    String PARAMETER_KEY_DATA = "changes";


    /**
     * PARAMETER_KEY_INFO
     */
    String RESULT_TYPE_I = "RESULT_TYPE_I";

    /**
     * PARAMETER_KEY_INFO, PARAMETER_KEY_MAPDATA
     */
    String RESULT_TYPE_IM = "RESULT_TYPE_IM";

    /**
     * PARAMETER_KEY_INFO,  PARAMETER_KEY_MAPDATA, PARAMETER_KEY_TABLEDATA, PARAMETER_KEY_COLUMNS_1
     */
    String RESULT_TYPE_IMTC_1 = "RESULT_TYPE_IMTC_1";

    /**
     * PARAMETER_KEY_INFO, PARAMETER_KEY_TABLEDATA, PARAMETER_KEY_COLUMNS_1
     */
    String RESULT_TYPE_ITC_1 = "RESULT_TYPE_ITC_1";

    /**
     * PARAMETER_KEY_INFO, PARAMETER_KEY_TABLEDATA, PARAMETER_KEY_COLUMNS_2
     */
    String RESULT_TYPE_ITC_2 = "RESULT_TYPE_ITC_2";


    /**
     * PARAMETER_KEY_INFO, PARAMETER_KEY_TABLEDATA, PARAMETER_KEY_COLUMNS_2, PARAMETER_KEY_ROWS_2
     */
    String RESULT_TYPE_ITCR_2 = "RESULT_TYPE_ITCR_2";

    /**
     * PARAMETER_KEY_INFO, PARAMETER_KEY_TABLEDATA_index...., PARAMETER_KEY_COLUMNS_1_index....
     */
    String RESULT_TYPE_ITC_1S = "RESULT_TYPE_ITC_1S";

    String RESULT_KEY_IM_DATA = "IM_DATA";
    String RESULT_KEY_ITC1_DATA = "ITC1_DATA";

    String PERMISSION_TYPE_READ = "READ";
    String PERMISSION_TYPE_UPDATE = "UPDATE";
    String PERMISSION_TYPE_DELETE = "DELETE";

    // RESULT_MESSAGE common
    String RESULT_MESSAGE_SUCCESS = "SUCCESS";

    // RESULT_CODE common
    // default
    String RESULT_CODE_SUCCESS = "RESULT_CODE_SUCCESS";
    String RESULT_CODE_FAIL = "RESULT_CODE_FAIL";

    String RESULT_CODE_PEMISSION_DENIED = "RESULT_CODE_PEMISSION_DENIED";
    String RESULT_CODE_SESSION_CLOSE = "RESULT_CODE_SESSION_CLOSE";
    String RESULT_CODE_MISSING_MESSAGE = "RESULT_CODE_MISSING_MESSAGE";


    class ServiceResultUtil {

        public static Map<String, Object> getServiceResultTypeIInformation(boolean sucess, String code, String message) {
            Map<String, Object> returnContents = new HashMap<>();
            Map<String, Object> resultInfo = getServiceResultInformation(sucess, code, message);
            returnContents.put(ServiceConstants.PARAMETER_KEY_INFO, resultInfo);

            return returnContents;
        }

        static Map<String, Object> getServiceResultInformation(boolean sucess, String code, String message) {
            Map<String, Object> resultInfo = new HashMap<>();
            resultInfo.put(ServiceConstants.PARAMETER_KEY_RESULT_SUCCESS, sucess);
            resultInfo.put(ServiceConstants.PARAMETER_KEY_RESULT_CODE, code);
            resultInfo.put(ServiceConstants.PARAMETER_KEY_RESULT_TYPE, ServiceConstants.RESULT_TYPE_I);
            resultInfo.put(ServiceConstants.PARAMETER_KEY_RESULT_MESSAGE, message);
            return resultInfo;
        }

    }

}
