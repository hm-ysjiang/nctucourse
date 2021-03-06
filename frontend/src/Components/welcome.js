import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, Checkbox, Button } from '@material-ui/core';

export default (props) => {
    let defaultShow
    //Check localStorage suppert
    if (window.localStorage) {
        //HACK 暫時先直接把更新時間寫死在檔案內
        const last_update_time = 1606567873169
        if (Number(window.localStorage.getItem('hideWelcomeTime')) < last_update_time) {
            window.localStorage.setItem('hideWelcome', "")
        }
        defaultShow = !Boolean(window.localStorage.getItem('hideWelcome'))
    }
    else {
        defaultShow = true
    }
    const [show, setShow] = useState(defaultShow)

    const handleClose = () => setShow(false)

    return <div>
        <Dialog open={show} scroll="paper" onClose={handleClose}>
            <DialogTitle>交大課程助理!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div>
                        歡迎使用交大學生製作的課程助理，本系統提供以下功能:<br />
                        <ul>
                            <li>模擬排課</li>
                            <li>雲端保存排課紀錄</li>
                            <li>匯出課表圖片</li>
                            <li>GPA 計算機</li>
                        </ul>
                        感謝您的使用，也歡迎推廣給更多需要的朋友們。<br />
                        若使用有任何問題或建議，請點選右下角"意見回饋"按鈕回報。<br /><br />
                        <b>更新(2020/11/28):</b>
                        <ul>
                            <li>新增空堂搜尋功能</li>
                            <li>新增查看過去模擬排課內容功能</li>
                            <li>修復設定無法儲存的問題</li>
                        </ul>
                        <b>更新(2020/09/09):</b>
                        <ul>
                            <li>縮寫搜尋功能(Ex. 透過"計圖學"搜尋"計算機圖學概論")</li>
                            <li>修復匯出課表跑版以及IOS系統下無法正常匯出的BUG</li>
                            <li>優化課表(顯示課堂教室位置)</li>
                        </ul>
                        <b>更新(2020/09/05):</b>
                        <ul>
                            <li>儲存模擬排課的設定</li>
                            <li>修復新用戶無法登入的漏洞</li>
                        </ul>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {window.localStorage &&
                    <FormControlLabel label="我知道了，不要再顯示。"
                        control={<Checkbox
                            onChange={(e) => {
                                window.localStorage.setItem('hideWelcome', e.target.checked ? "true" : "")
                                window.localStorage.setItem('hideWelcomeTime', Date.now())
                            }}
                        />} />
                }
                <Button onClick={handleClose} color="primary">
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    </div>
}