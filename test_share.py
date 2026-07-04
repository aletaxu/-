from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 收集 console 日志
    logs = []
    page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: logs.append(f"[PAGEERROR] {err}"))

    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)

    # 截图初始状态
    page.screenshot(path='/workspace/test_shots/01_initial.png', full_page=True)

    # 点击分享按钮（右上角橙色"分享"）
    share_btn = page.locator('button:has-text("分享")').first
    print("分享按钮存在:", share_btn.is_visible())
    share_btn.click()
    page.wait_for_timeout(800)
    page.screenshot(path='/workspace/test_shots/02_share_dialog.png', full_page=True)

    # 点击"生成二维码"
    qr_btn = page.locator('button:has-text("生成二维码")').first
    print("二维码按钮存在:", qr_btn.is_visible())
    qr_btn.click()
    page.wait_for_timeout(3000)  # 等待 QR 生成
    page.screenshot(path='/workspace/test_shots/03_after_qr.png', full_page=True)

    # 点击"下载图片到本地"
    dl_btn = page.locator('button:has-text("下载图片到本地")').first
    print("下载按钮存在:", dl_btn.is_visible())
    dl_btn.click()
    page.wait_for_timeout(5000)  # 等待导出
    page.screenshot(path='/workspace/test_shots/04_after_download.png', full_page=True)

    # 打印所有 console 日志
    print("\n=== Console Logs ===")
    for log in logs:
        print(log)

    browser.close()
