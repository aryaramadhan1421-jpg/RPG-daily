/* SYSTEM RPG - Beta 23 safe offline Quest Management.
   This module never awards Gold/EXP, alters Raid hits, or reevaluates historical days. */
(function () {
  'use strict';
  const TIME_SLOTS = ['Pagi','Siang','Sore','Malam','Fleksibel'];
  const DAYS = [0,1,2,3,4,5,6];
  const selected = new Set();
  let managing = false;
  const t = (id,en,ja) => {
    const l = (typeof gameState !== 'undefined' && gameState.language) || 'id';
    return l === 'en' ? en : l === 'ja' ? ja : id;
  };
  // Non-destructive notices never use browser-native alert('This page says').
  function inform(message) {
    let toast=document.getElementById('v7-ui-toast');
    if(!toast){toast=document.createElement('div');toast.id='v7-ui-toast';toast.className='v7-ui-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast);}
    toast.textContent=message;
    clearTimeout(inform._timer);
    inform._timer=setTimeout(()=>toast.remove(),3400);
  }
  function ask(message, token) {
    return new Promise(resolve=>{
      const layer=document.createElement('div');layer.className='v7-quest-dialog-backdrop';
      const dialog=document.createElement('div');dialog.className='v7-quest-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
      const h=document.createElement('strong');h.textContent=t('Konfirmasi Quest','Quest Confirmation','クエストの確認');
      const p=document.createElement('p');p.textContent=message;
      const actions=document.createElement('div');actions.className='v7-quest-dialog-actions';
      const cancel=document.createElement('button');cancel.type='button';cancel.textContent=t('Batal','Cancel','キャンセル');
      const accept=document.createElement('button');accept.type='button';accept.textContent=t('Konfirmasi','Confirm','確認');
      let input=null;
      if(token){input=document.createElement('input');input.setAttribute('aria-label',t('Ketik kata konfirmasi','Type confirmation word','確認の言葉を入力'));input.placeholder=token;accept.disabled=true;input.oninput=()=>{accept.disabled=input.value.trim()!==token;};}
      function finish(value){document.removeEventListener('keydown',keyHandler,true);layer.remove();resolve(value);}
      const keyHandler=e=>{if(e.key==='Escape'){e.preventDefault();finish(false);}};
      cancel.onclick=()=>finish(false);accept.onclick=()=>finish(true);
      actions.append(cancel,accept);dialog.append(h,p);if(input)dialog.append(input);dialog.append(actions);layer.append(dialog);document.body.appendChild(layer);
      document.addEventListener('keydown',keyHandler,true);(input||cancel).focus();
    });
  }
  function tomorrow() {
    const d = new Date(); d.setDate(d.getDate()+1);
    return typeof formatDateKey === 'function' ? formatDateKey(d) : [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }
  function data() {
    if (!gameState.v7PendingQuestOps || typeof gameState.v7PendingQuestOps !== 'object' || Array.isArray(gameState.v7PendingQuestOps))
      gameState.v7PendingQuestOps = {applyOn:tomorrow(),changes:{}};
    if (!gameState.v7PendingQuestOps.changes || typeof gameState.v7PendingQuestOps.changes !== 'object')
      gameState.v7PendingQuestOps.changes = {};
    return gameState.v7PendingQuestOps;
  }
  function pureApply(quests, changes) {
    if(!Array.isArray(quests))return [];
    return quests.filter(q=>!changes[String(q.id)]?.remove).map(q=>{
      const c=changes[String(q.id)] || {};
      if(!Object.keys(c).length)return q;
      const next={...q};
      if(TIME_SLOTS.includes(c.timeSlot))next.timeSlot=c.timeSlot;
      if(Array.isArray(c.activeDays) && c.activeDays.length && c.activeDays.every(d=>DAYS.includes(d)))
        next.activeDays=[...new Set(c.activeDays)];
      return next;
    });
  }
  function questsForDate(dateKey) {
    const pending=gameState && gameState.v7PendingQuestOps;
    return pending && pending.changes && pending.applyOn && dateKey>=pending.applyOn
      ? pureApply(gameState.quests,pending.changes) : gameState.quests;
  }
  function applyPendingQuestOps(today) {
    const pending=gameState && gameState.v7PendingQuestOps;
    if(!pending || !pending.applyOn || today<pending.applyOn || !pending.changes)return false;
    gameState.quests=pureApply(gameState.quests,pending.changes);
    delete gameState.v7PendingQuestOps;
    // Already settled evaluation records, daily snapshot, and Raid hit ledger are untouched.
    return true;
  }
  function visibleIds() {
    return [...document.querySelectorAll('#quest-list [data-quest-order-id]')].map(el=>el.dataset.questOrderId);
  }
  function renderControls() {
    const host=document.getElementById('v7-quest-manager');
    const panel=document.getElementById('v7-quest-manager-panel');if(!host||!panel)return;
    const pending=gameState && gameState.v7PendingQuestOps;
    const count=pending && pending.changes ? Object.keys(pending.changes).length:0;
    const status=count?`<p class="v7-bulk-pending">🕒 ${count} ${t('perubahan dijadwalkan mulai','changes scheduled for','件の変更：')} ${pending.applyOn} <button type="button" id="v7-bulk-cancel">${t('Batalkan perubahan','Cancel scheduled changes','変更を取り消す')}</button></p>`:'';
    const mode=managing?`<div class="v7-bulk-panel">
      <p>${selected.size} ${t('Quest dipilih','Quests selected','クエスト選択中')} · ${t('Berlaku besok; tidak mengubah progres hari ini','Applies tomorrow; today’s progress stays unchanged','変更は明日から。今日の進捗には影響しません')}</p>
      <div class="v7-bulk-row"><button type="button" id="v7-bulk-all">${t('Pilih Semua yang Ditampilkan','Select All Shown','表示中をすべて選択')}</button><button type="button" id="v7-bulk-none">${t('Batalkan Pilihan','Clear Selection','選択を解除')}</button></div>
      <p class="v7-bulk-helper">${t('Hanya Quest pada filter aktif yang dipilih.','Only Quests shown by your current filters are selected.','現在のフィルターに表示されたクエストのみ選択します。')}</p>
      <div class="v7-bulk-row"><select id="v7-bulk-time" aria-label="Time"><option value="">${t('Waktu: jangan ubah','Time: keep','時間：変更なし')}</option>${TIME_SLOTS.map(slot=>`<option value="${slot}">${({Pagi:t('Pagi','Morning','朝'),Siang:t('Siang','Noon','昼'),Sore:t('Sore','Evening','夕方'),Malam:t('Malam','Night','夜'),Fleksibel:t('Fleksibel','Flexible','自由')})[slot]}</option>`).join('')}</select>
      <select id="v7-bulk-days" aria-label="Schedule"><option value="">${t('Jadwal: jangan ubah','Schedule: keep','曜日：変更なし')}</option><option value="all">${t('Setiap hari','Every day','毎日')}</option><option value="weekdays">${t('Senin–Jumat','Mon–Fri','月〜金')}</option><option value="weekend">${t('Sabtu–Minggu','Sat–Sun','土日')}</option><option value="custom">${t('Hari pilihan…','Custom days…','曜日を選択…')}</option></select></div>
      <div class="v7-bulk-custom" id="v7-bulk-custom" hidden>${[t('Min','Sun','日'),t('Sen','Mon','月'),t('Sel','Tue','火'),t('Rab','Wed','水'),t('Kam','Thu','木'),t('Jum','Fri','金'),t('Sab','Sat','土')].map((day,i)=>`<label><input type="checkbox" data-day="${i}" checked>${day}</label>`).join('')}</div>
      <div class="v7-bulk-row"><button id="v7-bulk-save" type="button">${t('Simpan perubahan','Schedule edits','変更を予約')}</button><button id="v7-bulk-delete" class="v7-bulk-danger" type="button">${t('Hapus terpilih','Delete selected','選択項目を削除')}</button></div>
    </div>`:'';
    host.innerHTML=`<button type="button" id="v7-bulk-toggle" class="v7-bulk-toggle" aria-expanded="${managing}" aria-controls="v7-quest-manager-panel">☑ ${managing?t('Selesai','Done','完了'):t('Kelola','Manage','管理')}</button>`;
    panel.innerHTML=status+mode;
    panel.hidden=!(managing||count);
    host.querySelector('#v7-bulk-toggle').onclick=()=>{managing=!managing;selected.clear();if(typeof SoundFX!=='undefined')SoundFX.playClick();if(typeof renderQuests==='function')renderQuests();};
    const all=panel.querySelector('#v7-bulk-all');if(all)all.onclick=()=>{for(const id of visibleIds())selected.add(id);decorateQuestCards();};
    const none=panel.querySelector('#v7-bulk-none');if(none)none.onclick=()=>{selected.clear();decorateQuestCards();};
    const schedControl=panel.querySelector('#v7-bulk-days');
    if(schedControl)schedControl.onchange=()=>{panel.querySelector('#v7-bulk-custom').hidden=schedControl.value!=='custom';};
    const save=panel.querySelector('#v7-bulk-save');if(save)save.onclick=()=>queue(false);
    const del=panel.querySelector('#v7-bulk-delete');if(del)del.onclick=()=>queue(true);
    const cancel=panel.querySelector('#v7-bulk-cancel');if(cancel)cancel.onclick=async()=>{
      if(!(await ask(t('Batalkan semua perubahan Quest terjadwal?','Cancel all scheduled Quest changes?','予約済みの変更を全て取り消しますか？'))))return;
      const old=gameState.v7PendingQuestOps;delete gameState.v7PendingQuestOps;
      if(saveState()===false)gameState.v7PendingQuestOps=old;
      renderControls();
    };
  }
  async function queue(isDelete) {
    const ids=[...selected].filter(id=>gameState.quests.some(q=>String(q.id)===id));
    if(!ids.length){inform(t('Pilih Quest dahulu.','Select Quests first.','クエストを選択してください。'));return false;}
    const slot=document.getElementById('v7-bulk-time')?.value||'';
    const sched=document.getElementById('v7-bulk-days')?.value||'';
    if(!isDelete&&!slot&&!sched){inform(t('Pilih waktu atau jadwal yang ingin diubah.','Select a time or schedule change.','時間または曜日を選択してください。'));return false;}
    const customDays=sched==='custom'?[...document.querySelectorAll('#v7-bulk-custom input:checked')].map(el=>Number(el.dataset.day)):[];
    if(!isDelete&&sched==='custom'&&!customDays.length){inform(t('Pilih setidaknya satu hari.','Select at least one day.','曜日を一つ以上選んでください。'));return false;}
    if(isDelete){
      const token=t('HAPUS','DELETE','削除');
      if(!(await ask(t(`Hapus ${ids.length} Quest mulai besok? History dan Raid terdahulu tidak akan dihapus. Ketik ${token} untuk konfirmasi.`,
        `Delete ${ids.length} Quests starting tomorrow? Existing History and Raid stay intact. Type ${token} to confirm.`,
        `${ids.length}件を明日から削除します。過去の履歴とレイドは保持。確認：${token}を入力してください。`),token)))return false;
    } else if(!(await ask(t(`Terapkan perubahan ke ${ids.length} Quest mulai besok?`, `Schedule changes to ${ids.length} Quests starting tomorrow?`,`${ids.length}件の変更を明日から適用しますか？`))))return false;
    const prev=gameState.v7PendingQuestOps?JSON.parse(JSON.stringify(gameState.v7PendingQuestOps)):null;
    const pending=data();pending.applyOn=tomorrow();
    for(const id of ids){
      const change={...(pending.changes[id]||{})};
      if(isDelete)pending.changes[id]={remove:true};
      else {
        if(slot && TIME_SLOTS.includes(slot))change.timeSlot=slot;
        if(sched)change.activeDays=sched==='weekdays'?[1,2,3,4,5]:sched==='weekend'?[0,6]:sched==='custom'?customDays:[0,1,2,3,4,5,6];
        pending.changes[id]=change;
      }
    }
    if(saveState()===false){if(prev)gameState.v7PendingQuestOps=prev;else delete gameState.v7PendingQuestOps;inform(t('Gagal menyimpan; perubahan dibatalkan.','Save failed; changes canceled.','保存できませんでした。'));return false;}
    selected.clear();managing=false;renderQuests();
    if(typeof spawnFloatingReward==='function')spawnFloatingReward(t('✓ Perubahan Quest dijadwalkan untuk besok','✓ Quest changes scheduled for tomorrow','✓ 明日からの変更を予約しました'));
    return true;
  }
  function decorateQuestCards() {
    const host=document.getElementById('v7-quest-manager');if(!host)return;
    renderControls();
    for(const card of document.querySelectorAll('#quest-list [data-quest-order-id]')) {
      const id=card.dataset.questOrderId;
      card.classList.toggle('v7-manage-active',managing);
      card.querySelector('.v7-select-quest')?.remove();
      if(managing){
        const label=document.createElement('label');label.className='v7-select-quest';
        label.setAttribute('aria-label',t('Pilih Quest','Select Quest','クエスト選択'));
        const check=document.createElement('input');check.type='checkbox';check.checked=selected.has(id);
        check.onchange=()=>{if(check.checked)selected.add(id);else selected.delete(id);renderControls();};
        label.appendChild(check);card.prepend(label);
      }
    }
  }
  document.addEventListener('DOMContentLoaded',decorateQuestCards);
  window.addEventListener('system-language-changed',()=>{renderControls();decorateQuestCards();});
  window.V7Quality={pureApply,questsForDate,applyPendingQuestOps,decorateQuestCards,isManaging:()=>managing};
})();
