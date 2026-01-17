# RLS Audit v0 (Lane A)

This audit captures the RLS state for v0 tables and summarizes expected behavior.

## Tables with RLS enabled

Query:
```
select c.relname, c.relrowsecurity
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relrowsecurity = true
order by c.relname;
```

Result:
```
[{"relname":"books","relrowsecurity":true},{"relname":"consensus_lines","relrowsecurity":true},{"relname":"games","relrowsecurity":true},{"relname":"markets","relrowsecurity":true},{"relname":"odds_snapshots","relrowsecurity":true},{"relname":"picks","relrowsecurity":true},{"relname":"profiles","relrowsecurity":true},{"relname":"teams","relrowsecurity":true},{"relname":"user_odds","relrowsecurity":true},{"relname":"user_preferences","relrowsecurity":true}]
```

## Policies (summary)

Query:
```
select tablename, policyname, cmd, roles, qual as using_expr, with_check
from pg_policies
where schemaname='public'
  and tablename in ('profiles','user_preferences','user_odds','picks','games')
order by tablename, policyname;
```

Result:
```
[{"tablename":"games","policyname":"Games read authenticated","cmd":"SELECT","roles":"{public}","using_expr":"(auth.role() = 'authenticated'::text)","with_check":null},{"tablename":"picks","policyname":"Picks delete own","cmd":"DELETE","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"picks","policyname":"Picks insert own","cmd":"INSERT","roles":"{public}","using_expr":null,"with_check":"(user_id = auth.uid())"},{"tablename":"picks","policyname":"Picks select own","cmd":"SELECT","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"picks","policyname":"Picks update own","cmd":"UPDATE","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"profiles","policyname":"Profiles insert own","cmd":"INSERT","roles":"{public}","using_expr":null,"with_check":"(id = auth.uid())"},{"tablename":"profiles","policyname":"Profiles select own","cmd":"SELECT","roles":"{public}","using_expr":"(id = auth.uid())","with_check":null},{"tablename":"profiles","policyname":"Profiles update own","cmd":"UPDATE","roles":"{public}","using_expr":"(id = auth.uid())"},{"tablename":"user_odds","policyname":"User odds delete own","cmd":"DELETE","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"user_odds","policyname":"User odds insert own","cmd":"INSERT","roles":"{public}","using_expr":null,"with_check":"(user_id = auth.uid())"},{"tablename":"user_odds","policyname":"User odds select own","cmd":"SELECT","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"user_odds","policyname":"User odds update own","cmd":"UPDATE","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"user_preferences","policyname":"User preferences delete own","cmd":"DELETE","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"user_preferences","policyname":"User preferences insert own","cmd":"INSERT","roles":"{public}","using_expr":null,"with_check":"(user_id = auth.uid())"},{"tablename":"user_preferences","policyname":"User preferences select own","cmd":"SELECT","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null},{"tablename":"user_preferences","policyname":"User preferences update own","cmd":"UPDATE","roles":"{public}","using_expr":"(user_id = auth.uid())","with_check":null}]
```

## Expected behavior

- Anonymous users: no access to user-owned tables (profiles, preferences, user_odds, picks).
- Authenticated users: can read `games` and only their own rows in user tables.
- Inserts/updates must pass own-row checks via `auth.uid()`.
