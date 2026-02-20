# Merge Cursor workspace state so old agent chats appear in renamed project.
# Run: python merge_cursor_state.py
# Close Cursor before running.

import os
import sqlite3
import shutil
import json

APPDATA = os.environ.get('APPDATA', os.path.join(os.environ['USERPROFILE'], 'AppData', 'Roaming'))
BASE = os.path.join(APPDATA, 'Cursor', 'User', 'workspaceStorage')

OLD_ID = 'ce63c7d1601cf934b402b4e45035e59b'  # cursorProject
NEW_ID = 'a5e7dd2705c74feebbe76bea1e3962c5'  # todo-fullstack

old_db = os.path.join(BASE, OLD_ID, 'state.vscdb')
new_db = os.path.join(BASE, NEW_ID, 'state.vscdb')

if not os.path.isfile(old_db):
    print('Old DB not found:', old_db)
    exit(1)
if not os.path.isfile(new_db):
    print('New DB not found:', new_db)
    exit(1)

# Backup
backup = new_db + '.backup-before-merge'
shutil.copy2(new_db, backup)
print('Backed up to', backup)

conn_old = sqlite3.connect(old_db)
conn_new = sqlite3.connect(new_db)

cur_old = conn_old.execute("SELECT key, value FROM ItemTable")
rows_old = {k: v for k, v in cur_old.fetchall()}
conn_old.close()

cur_new = conn_new.execute("SELECT key, value FROM ItemTable")
rows_new = {k: v for k, v in cur_new.fetchall()}

# 1. Merge composer.composerData (allComposers list by composerId)
COMPOSER_KEY = 'composer.composerData'
if COMPOSER_KEY in rows_old and COMPOSER_KEY in rows_new:
    old_data = json.loads(rows_old[COMPOSER_KEY])
    new_data = json.loads(rows_new[COMPOSER_KEY])
    old_composers = old_data.get('allComposers') or []
    new_composers = new_data.get('allComposers') or []
    existing_ids = {c.get('composerId') for c in new_composers if c.get('composerId')}
    added = 0
    for c in old_composers:
        cid = c.get('composerId')
        if cid and cid not in existing_ids:
            new_composers.append(c)
            existing_ids.add(cid)
            added += 1
            print('  Adding composer:', cid, c.get('name', '(no name)')[:50])
    new_data['allComposers'] = new_composers
    rows_new[COMPOSER_KEY] = json.dumps(new_data)
    cur_new = conn_new.cursor()
    cur_new.execute("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)",
                    (COMPOSER_KEY, rows_new[COMPOSER_KEY]))
    conn_new.commit()
    print('Merged composer.composerData: added', added, 'old chats')
else:
    print('composer.composerData not found in one DB, skipping merge')

# 2. Merge workbench.auxiliarybar.initialViewContainers (list of panel ids)
INIT_KEY = 'workbench.auxiliarybar.initialViewContainers'
if INIT_KEY in rows_old and INIT_KEY in rows_new:
    old_list = json.loads(rows_old[INIT_KEY])
    new_list = json.loads(rows_new[INIT_KEY])
    existing = set(new_list)
    for pid in old_list:
        if pid not in existing and 'aichat' in pid:
            new_list.append(pid)
            existing.add(pid)
    cur_new = conn_new.cursor()
    cur_new.execute("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)",
                    (INIT_KEY, json.dumps(new_list)))
    conn_new.commit()
    print('Merged', INIT_KEY)

# 3. Merge workbench.auxiliarybar.viewContainersWorkspaceState (list of {id, visible})
VIEW_KEY = 'workbench.auxiliarybar.viewContainersWorkspaceState'
if VIEW_KEY in rows_old and VIEW_KEY in rows_new:
    old_list = json.loads(rows_old[VIEW_KEY])
    new_list = json.loads(rows_new[VIEW_KEY])
    existing_ids = {e.get('id') for e in new_list if e.get('id')}
    for e in old_list:
        eid = e.get('id')
        if eid and eid not in existing_ids and 'aichat' in eid:
            new_list.append(e)
            existing_ids.add(eid)
    cur_new = conn_new.cursor()
    cur_new.execute("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)",
                    (VIEW_KEY, json.dumps(new_list)))
    conn_new.commit()
    print('Merged', VIEW_KEY)

# 4. Copy other composer/chat-related keys from old that don't exist in new
#    (e.g. workbench.panel.composerChatViewPane.* for old composer ids)
for key, value in rows_old.items():
    if key in rows_new:
        continue
    if 'composerChatViewPane' in key or ('panel.aichat' in key and 'view.' in key):
        cur_new = conn_new.cursor()
        cur_new.execute("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)", (key, value))
        conn_new.commit()
        print('Copied key:', key[:80])

conn_new.close()
print('Done. Restart Cursor to see old chats.')
