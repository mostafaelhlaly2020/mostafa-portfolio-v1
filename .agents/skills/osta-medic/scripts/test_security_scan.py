#!/usr/bin/env python3
"""
Tests for security_scan.py — Security Sweep helper.

Run with:
    python3 -m unittest test_security_scan.py -v
"""

import os
import sys
import tempfile
import unittest

# Add the directory containing security_scan.py to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from security_scan import (
    CHECKS,
    LOW_SIGNAL_PATH_HINTS,
    MAX_FILE_BYTES,
    SECRET_PLACEHOLDER_RE,
    SKIP_DIRS,
    check_command_injection,
    check_csrf_missing_hint,
    check_debug_or_cors_misconfig,
    check_hardcoded_secret,
    check_insecure_deserialization,
    check_insecure_randomness_for_tokens,
    check_jwt_no_expiry,
    check_mass_assignment,
    check_path_traversal,
    check_sensitive_logging,
    check_sql_injection,
    check_unsafe_upload_naming,
    check_weak_crypto_for_secrets,
    check_weak_token_storage,
    check_xss,
    contains_any,
    iter_files,
    scan_file,
)


class TestContainsAny(unittest.TestCase):
    def test_returns_true_when_word_present(self):
        self.assertTrue(contains_any("check the password here", ["password"]))

    def test_returns_true_case_insensitive(self):
        self.assertTrue(contains_any("SECRET=abc", ["secret"]))

    def test_returns_true_on_first_match(self):
        self.assertTrue(contains_any("token reset logic", ["token", "session"]))

    def test_returns_false_when_no_match(self):
        self.assertFalse(contains_any("hello world", ["password", "token"]))

    def test_returns_false_on_empty_line(self):
        self.assertFalse(contains_any("", ["password"]))

    def test_returns_false_on_empty_words(self):
        self.assertFalse(contains_any("some text", []))

    def test_matches_substring(self):
        # "passwd" contains "pass" but the check word "passwd" should match exactly
        self.assertTrue(contains_any("check passwd here", ["passwd"]))


class TestSecretPlaceholderRe(unittest.TestCase):
    def test_matches_changeme(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("password = 'changeme'"))

    def test_matches_your_api(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("api_key = your_api_key"))

    def test_matches_placeholder(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("token = placeholder"))

    def test_matches_xxxx(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("key = 'xxxx1234'"))

    def test_matches_example(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search('secret = "example_key"'))

    def test_matches_angle_brackets(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("api_key = <YOUR_KEY>"))

    def test_matches_template_placeholder(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("secret = ${SECRET_KEY}"))

    def test_matches_insert_key(self):
        self.assertIsNotNone(SECRET_PLACEHOLDER_RE.search("key = insert_key_here"))

    def test_does_not_match_real_secret(self):
        self.assertIsNone(SECRET_PLACEHOLDER_RE.search("api_key = 'sk_live_realkey123abc'"))


class TestCheckHardcodedSecret(unittest.TestCase):
    # --- Positive cases (should detect) ---
    def test_detects_api_key_assignment(self):
        self.assertTrue(check_hardcoded_secret("api_key = 'realkey12345678'"))

    def test_detects_secret_assignment(self):
        self.assertTrue(check_hardcoded_secret('secret = "mysupersecretvalue"'))

    def test_detects_password_assignment(self):
        self.assertTrue(check_hardcoded_secret("password = 'SuperSecret1!'"))

    def test_detects_token_assignment(self):
        self.assertTrue(check_hardcoded_secret("token = 'abcdefghijklmnop'"))

    def test_detects_aws_access_key(self):
        # Use a key without placeholder/example words to avoid the placeholder filter
        self.assertTrue(check_hardcoded_secret("AKIAAAAABBBBCCCCDDDD"))

    def test_detects_stripe_live_key(self):
        self.assertTrue(check_hardcoded_secret("sk_live_AbCdEfGhIjKlMnOpQrSt"))

    def test_detects_github_pat(self):
        self.assertTrue(check_hardcoded_secret("ghp_" + "A" * 36))

    def test_detects_rsa_private_key_header(self):
        self.assertTrue(check_hardcoded_secret("-----BEGIN RSA PRIVATE KEY-----"))

    def test_detects_ec_private_key_header(self):
        self.assertTrue(check_hardcoded_secret("-----BEGIN EC PRIVATE KEY-----"))

    def test_detects_openssh_private_key_header(self):
        self.assertTrue(check_hardcoded_secret("-----BEGIN OPENSSH PRIVATE KEY-----"))

    def test_detects_private_key_no_type(self):
        self.assertTrue(check_hardcoded_secret("-----BEGIN PRIVATE KEY-----"))

    def test_detects_passwd_variant(self):
        self.assertTrue(check_hardcoded_secret("passwd = 'actualpassword1'"))

    # --- Negative cases (should NOT detect) ---
    def test_ignores_placeholder_changeme(self):
        self.assertFalse(check_hardcoded_secret("password = 'changeme'"))

    def test_ignores_your_api_key_placeholder(self):
        self.assertFalse(check_hardcoded_secret("api_key = your_api_key"))

    def test_ignores_example_secret(self):
        self.assertFalse(check_hardcoded_secret('secret = "example"'))

    def test_ignores_template_variable(self):
        self.assertFalse(check_hardcoded_secret("api_key = ${API_KEY}"))

    def test_ignores_short_value(self):
        # Fewer than 8 chars in the quoted value
        self.assertFalse(check_hardcoded_secret("api_key = 'short'"))

    def test_ignores_env_var_reference(self):
        # Not a string literal, just a variable reference
        self.assertFalse(check_hardcoded_secret("api_key = process.env.API_KEY"))


class TestCheckSqlInjection(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_template_literal_select(self):
        # Pattern detects when user input is in a quoted interpolation inside a template literal
        self.assertTrue(check_sql_injection(
            "db.query(`SELECT * FROM orders WHERE id = '${orderId}'`)"
        ))

    def test_detects_python_fstring_select(self):
        # Pattern detects f-strings where the variable is interpolated directly (no inner quotes)
        self.assertTrue(check_sql_injection(
            'f"SELECT * FROM users WHERE id = {uid}"'
        ))

    def test_detects_string_concat_select(self):
        self.assertTrue(check_sql_injection(
            '"SELECT * FROM users WHERE id = " + userId'
        ))

    def test_detects_execute_percent_format(self):
        self.assertTrue(check_sql_injection(
            "cursor.execute(\"SELECT * FROM t WHERE id = %s\" % val)"
        ))

    def test_detects_insert_template_literal(self):
        # Pattern detects INSERT with quoted interpolation inside template literal
        self.assertTrue(check_sql_injection(
            "db.query(`INSERT INTO users VALUES '${data}'`)"
        ))

    def test_detects_update_fstring(self):
        # Pattern detects f-string UPDATE with direct interpolation (no inner quotes)
        self.assertTrue(check_sql_injection(
            'f"UPDATE users SET status = {status}"'
        ))

    # --- Negative cases ---
    def test_ignores_parameterized_query(self):
        self.assertFalse(check_sql_injection(
            'db.query("SELECT * FROM orders WHERE id = ?", [orderId])'
        ))

    def test_ignores_safe_sql_string(self):
        self.assertFalse(check_sql_injection(
            "query = 'SELECT * FROM users'"
        ))

    def test_ignores_orm_query(self):
        self.assertFalse(check_sql_injection(
            "User.objects.filter(email=email).first()"
        ))


class TestCheckCommandInjection(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_os_system(self):
        self.assertTrue(check_command_injection("os.system('ls -la')"))

    def test_detects_subprocess_popen_shell_true(self):
        self.assertTrue(check_command_injection(
            "subprocess.Popen(cmd, shell=True)"
        ))

    def test_detects_subprocess_call_shell_true(self):
        self.assertTrue(check_command_injection(
            "subprocess.call(cmd, shell=True)"
        ))

    def test_detects_subprocess_run_shell_true(self):
        self.assertTrue(check_command_injection(
            "subprocess.run(cmd, shell=True)"
        ))

    def test_detects_node_child_process_exec(self):
        self.assertTrue(check_command_injection(
            "child_process.exec(`convert ${filename} out.png`);"
        ))

    def test_detects_java_runtime_exec(self):
        self.assertTrue(check_command_injection(
            'Runtime.getRuntime().exec("cmd /c dir");'
        ))

    # --- Negative cases ---
    def test_ignores_subprocess_run_without_shell(self):
        self.assertFalse(check_command_injection(
            'subprocess.run(["ls", "-la"])'
        ))

    def test_ignores_subprocess_popen_shell_false(self):
        self.assertFalse(check_command_injection(
            'subprocess.Popen(["cmd"], shell=False)'
        ))

    def test_ignores_unrelated_exec(self):
        self.assertFalse(check_command_injection(
            "Promise.resolve().then(() => exec())"
        ))


class TestCheckXss(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_dangerous_inner_html(self):
        self.assertTrue(check_xss(
            '<div dangerouslySetInnerHTML={{ __html: comment.body }} />'
        ))

    def test_detects_inner_html_assignment(self):
        self.assertTrue(check_xss("element.innerHTML = userContent;"))

    def test_detects_v_html_directive(self):
        self.assertTrue(check_xss('<div v-html="comment.body"></div>'))

    def test_detects_jinja_safe_filter(self):
        self.assertTrue(check_xss("{{ comment.body|safe }}"))

    def test_detects_document_write(self):
        self.assertTrue(check_xss("document.write(userContent)"))

    def test_detects_inner_html_with_spaces(self):
        self.assertTrue(check_xss("el.innerHTML  =  data"))

    # --- Negative cases ---
    def test_ignores_text_content(self):
        self.assertFalse(check_xss("element.textContent = userContent"))

    def test_ignores_normal_template(self):
        self.assertFalse(check_xss("{{ comment.body }}"))

    def test_ignores_react_text_render(self):
        self.assertFalse(check_xss("<div>{comment.body}</div>"))


class TestCheckCsrfMissingHint(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_post_without_csrf(self):
        self.assertTrue(check_csrf_missing_hint(
            'app.post("/login", auth, handler)'
        ))

    def test_detects_put_without_csrf(self):
        self.assertTrue(check_csrf_missing_hint(
            'app.put("/users/:id", auth, handler)'
        ))

    def test_detects_patch_without_csrf(self):
        self.assertTrue(check_csrf_missing_hint(
            'app.patch("/profile", auth, handler)'
        ))

    def test_detects_delete_without_csrf(self):
        self.assertTrue(check_csrf_missing_hint(
            'app.delete("/items/:id", auth, handler)'
        ))

    # --- Negative cases ---
    def test_ignores_post_with_csrf(self):
        self.assertFalse(check_csrf_missing_hint(
            'app.post("/login", auth, csrf, handler)'
        ))

    def test_ignores_post_with_csrf_middleware_uppercase(self):
        self.assertFalse(check_csrf_missing_hint(
            'app.post("/login", auth, csrfProtection, handler)'
        ))

    def test_ignores_get_route(self):
        self.assertFalse(check_csrf_missing_hint(
            'app.get("/users", auth, handler)'
        ))

    def test_ignores_app_use(self):
        self.assertFalse(check_csrf_missing_hint(
            'app.use(express.json())'
        ))


class TestCheckWeakCryptoForSecrets(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_md5_password(self):
        self.assertTrue(check_weak_crypto_for_secrets(
            "hashed = md5(password)"
        ))

    def test_detects_sha1_password(self):
        self.assertTrue(check_weak_crypto_for_secrets(
            "digest = sha1(userPassword)"
        ))

    def test_detects_md5_secret(self):
        self.assertTrue(check_weak_crypto_for_secrets(
            "token = MD5(secret)"
        ))

    def test_detects_sha1_passwd(self):
        self.assertTrue(check_weak_crypto_for_secrets(
            "hash = sha1(passwd)"
        ))

    # --- Negative cases ---
    def test_ignores_md5_without_secret_context(self):
        self.assertFalse(check_weak_crypto_for_secrets(
            "checksum = md5(filename)"
        ))

    def test_ignores_sha256_password(self):
        # sha256 is not in weak hash list
        self.assertFalse(check_weak_crypto_for_secrets(
            "hashed = sha256(password)"
        ))

    def test_ignores_bcrypt_password(self):
        self.assertFalse(check_weak_crypto_for_secrets(
            "hashed = bcrypt.hash(password)"
        ))


class TestCheckInsecureRandomnessForTokens(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_math_random_token(self):
        self.assertTrue(check_insecure_randomness_for_tokens(
            "const token = Math.random().toString(36);"
        ))

    def test_detects_math_random_session(self):
        self.assertTrue(check_insecure_randomness_for_tokens(
            "sessionId = Math.random();"
        ))

    def test_detects_python_random_token(self):
        self.assertTrue(check_insecure_randomness_for_tokens(
            "reset_token = random.random()"
        ))

    def test_detects_rand_password(self):
        self.assertTrue(check_insecure_randomness_for_tokens(
            "temp_password = rand()"
        ))

    # --- Negative cases ---
    def test_ignores_math_random_without_token_context(self):
        self.assertFalse(check_insecure_randomness_for_tokens(
            "x = Math.random() * 100"
        ))

    def test_ignores_crypto_random_bytes_token(self):
        self.assertFalse(check_insecure_randomness_for_tokens(
            "token = crypto.randomBytes(32).toString('hex')"
        ))

    def test_ignores_secrets_module_token(self):
        self.assertFalse(check_insecure_randomness_for_tokens(
            "token = secrets.token_hex(32)"
        ))


class TestCheckInsecureDeserialization(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_pickle_loads(self):
        self.assertTrue(check_insecure_deserialization("data = pickle.loads(raw)"))

    def test_detects_pickle_load(self):
        self.assertTrue(check_insecure_deserialization("data = pickle.load(f)"))

    def test_detects_yaml_load_without_loader(self):
        self.assertTrue(check_insecure_deserialization("config = yaml.load(f)"))

    def test_detects_php_unserialize(self):
        self.assertTrue(check_insecure_deserialization("$obj = unserialize($data);"))

    def test_detects_java_object_input_stream(self):
        self.assertTrue(check_insecure_deserialization(
            "ObjectInputStream ois = new ObjectInputStream(input);"
        ))

    def test_detects_ruby_marshal_load(self):
        self.assertTrue(check_insecure_deserialization("obj = Marshal.load(data)"))

    # --- Negative cases ---
    def test_ignores_json_loads(self):
        self.assertFalse(check_insecure_deserialization("data = json.loads(raw)"))

    def test_ignores_yaml_safe_load(self):
        self.assertFalse(check_insecure_deserialization("config = yaml.safe_load(f)"))

    def test_ignores_yaml_load_with_safe_loader(self):
        self.assertFalse(check_insecure_deserialization(
            "config = yaml.load(f, Loader=yaml.SafeLoader)"
        ))

    def test_ignores_yaml_load_with_loader_param(self):
        # Has "Loader" anywhere after yaml.load(
        self.assertFalse(check_insecure_deserialization(
            "yaml.load(stream, Loader=FullLoader)"
        ))


class TestCheckDebugOrCorsConfig(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_debug_true_uppercase(self):
        self.assertTrue(check_debug_or_cors_misconfig("DEBUG = True"))

    def test_detects_debug_true_lowercase_js(self):
        # Pattern matches `debug: true` (JS/YAML style); JSON `"debug": true` has quotes around key
        self.assertTrue(check_debug_or_cors_misconfig('server = { debug: true }'))

    def test_detects_app_run_debug_true(self):
        self.assertTrue(check_debug_or_cors_misconfig(
            'app.run(host="0.0.0.0", debug=True)'
        ))

    def test_detects_cors_wildcard_header(self):
        self.assertTrue(check_debug_or_cors_misconfig(
            "Access-Control-Allow-Origin: '*'"
        ))

    def test_detects_cors_origin_true(self):
        self.assertTrue(check_debug_or_cors_misconfig("cors({ origin: true })"))

    def test_detects_cors_origin_wildcard_string(self):
        self.assertTrue(check_debug_or_cors_misconfig("origin: '*'"))

    # --- Negative cases ---
    def test_ignores_debug_false(self):
        self.assertFalse(check_debug_or_cors_misconfig("DEBUG = False"))

    def test_ignores_cors_specific_origin(self):
        self.assertFalse(check_debug_or_cors_misconfig(
            "cors({ origin: 'https://myapp.com' })"
        ))

    def test_ignores_debug_env_check(self):
        self.assertFalse(check_debug_or_cors_misconfig(
            "debug = os.environ.get('APP_DEBUG') == '1'"
        ))


class TestCheckMassAssignment(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_object_assign_req_body(self):
        self.assertTrue(check_mass_assignment(
            "Object.assign(user, req.body)"
        ))

    def test_detects_django_update_with_request_json(self):
        self.assertTrue(check_mass_assignment(
            "user.update(**request.json)"
        ))

    def test_detects_django_update_with_request_post(self):
        self.assertTrue(check_mass_assignment(
            "obj.update(**request.POST)"
        ))

    def test_detects_mongoose_find_and_update_req_body(self):
        self.assertTrue(check_mass_assignment(
            "User.findByIdAndUpdate(req.params.id, req.body)"
        ))

    # --- Negative cases ---
    def test_ignores_object_assign_specific_fields(self):
        self.assertFalse(check_mass_assignment(
            "Object.assign(user, { name: req.body.name })"
        ))

    def test_ignores_find_by_id_with_specific_field(self):
        # req.body.name has .word after req.body, so should not match
        self.assertFalse(check_mass_assignment(
            "User.findByIdAndUpdate(id, req.body.name)"
        ))

    def test_ignores_update_without_request(self):
        self.assertFalse(check_mass_assignment(
            "user.update({ name: 'Alice' })"
        ))


class TestCheckWeakTokenStorage(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_localstorage_token(self):
        self.assertTrue(check_weak_token_storage(
            'localStorage.setItem("token", accessToken)'
        ))

    def test_detects_localstorage_password(self):
        self.assertTrue(check_weak_token_storage(
            "localStorage.setItem('password', hash)"
        ))

    def test_detects_localstorage_secret(self):
        self.assertTrue(check_weak_token_storage(
            "localStorage.setItem('secret', value)"
        ))

    def test_detects_sessionstorage_token(self):
        self.assertTrue(check_weak_token_storage(
            "sessionStorage.setItem('token', jwt)"
        ))

    def test_detects_case_insensitive_token(self):
        self.assertTrue(check_weak_token_storage(
            'localStorage.setItem("TOKEN", val)'
        ))

    # --- Negative cases ---
    def test_ignores_localstorage_username(self):
        self.assertFalse(check_weak_token_storage(
            "localStorage.setItem('username', user.name)"
        ))

    def test_ignores_localstorage_theme(self):
        self.assertFalse(check_weak_token_storage(
            "localStorage.setItem('theme', 'dark')"
        ))

    def test_ignores_cookie_token(self):
        # httpOnly cookie storage is the correct pattern
        self.assertFalse(check_weak_token_storage(
            "res.cookie('token', value, { httpOnly: true })"
        ))


class TestCheckJwtNoExpiry(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_jwt_sign_without_expiry(self):
        self.assertTrue(check_jwt_no_expiry(
            "const token = jwt.sign({ userId: user.id }, secret);"
        ))

    def test_detects_jwt_sign_without_expiry_in_options(self):
        self.assertTrue(check_jwt_no_expiry(
            "jwt.sign(payload, key, { algorithm: 'HS256' })"
        ))

    # --- Negative cases ---
    def test_ignores_jwt_sign_with_expiry(self):
        self.assertFalse(check_jwt_no_expiry(
            "jwt.sign({ userId: id }, secret, { expiresIn: '15m' })"
        ))

    def test_ignores_jwt_verify(self):
        self.assertFalse(check_jwt_no_expiry(
            "jwt.verify(token, secret)"
        ))

    def test_ignores_jwt_decode(self):
        self.assertFalse(check_jwt_no_expiry(
            "jwt.decode(token)"
        ))


class TestCheckSensitiveLogging(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_console_log_password(self):
        self.assertTrue(check_sensitive_logging(
            "console.log('Login attempt', { password: req.body.password })"
        ))

    def test_detects_logger_info_token(self):
        self.assertTrue(check_sensitive_logging(
            "logger.info('Request received', token)"
        ))

    def test_detects_print_req_body(self):
        self.assertTrue(check_sensitive_logging(
            "print('Debug:', req.body)"
        ))

    def test_detects_logger_debug_secret(self):
        self.assertTrue(check_sensitive_logging(
            "logger.debug('Config:', secret)"
        ))

    def test_detects_logger_info_ssn(self):
        self.assertTrue(check_sensitive_logging(
            "logger.info('User:', { ssn: user.ssn })"
        ))

    def test_detects_logger_warn_card(self):
        self.assertTrue(check_sensitive_logging(
            "logger.warn('Payment:', card_number)"
        ))

    # --- Negative cases ---
    def test_ignores_logger_info_non_sensitive_field(self):
        # req.body itself is flagged, but logging just the email field from a separate variable is safe
        self.assertFalse(check_sensitive_logging(
            "logger.info('Login attempt', { email: user.email })"
        ))

    def test_ignores_console_log_without_sensitive(self):
        self.assertFalse(check_sensitive_logging(
            "console.log('Server started on port 3000')"
        ))

    def test_ignores_non_log_line_with_password(self):
        self.assertFalse(check_sensitive_logging(
            "if (user.password === hash) {"
        ))


class TestCheckUnsafeUploadNaming(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_file_original_name(self):
        self.assertTrue(check_unsafe_upload_naming(
            "filename: (req, file, cb) => cb(null, file.originalname)"
        ))

    def test_detects_request_files_filename(self):
        self.assertTrue(check_unsafe_upload_naming(
            "name = request.files['photo'].filename"
        ))

    def test_detects_request_files_bracket_filename(self):
        self.assertTrue(check_unsafe_upload_naming(
            "request.files['upload'].filename"
        ))

    # --- Negative cases ---
    def test_ignores_random_uuid_filename(self):
        self.assertFalse(check_unsafe_upload_naming(
            "filename = crypto.randomUUID() + ext"
        ))

    def test_ignores_server_generated_name(self):
        self.assertFalse(check_unsafe_upload_naming(
            "stored_name = str(uuid.uuid4())"
        ))


class TestCheckPathTraversal(unittest.TestCase):
    # --- Positive cases ---
    def test_detects_path_join_req_params(self):
        self.assertTrue(check_path_traversal(
            "const fp = path.join(uploadDir, req.params.filename)"
        ))

    def test_detects_path_join_req_query(self):
        self.assertTrue(check_path_traversal(
            "path.join(baseDir, req.query.name)"
        ))

    def test_detects_path_join_req_body(self):
        self.assertTrue(check_path_traversal(
            "path.join(__dirname, req.body.file)"
        ))

    def test_detects_python_os_path_join_request_args(self):
        self.assertTrue(check_path_traversal(
            "os.path.join('uploads', request.args['name'])"
        ))

    def test_detects_python_os_path_join_request_form(self):
        self.assertTrue(check_path_traversal(
            "os.path.join('/uploads', request.form.get('filename'))"
        ))

    # --- Negative cases ---
    def test_ignores_path_join_safe_inputs(self):
        self.assertFalse(check_path_traversal(
            "path.join(__dirname, 'static', 'uploads')"
        ))

    def test_ignores_path_join_with_record(self):
        self.assertFalse(check_path_traversal(
            "os.path.join('/uploads', record.storage_path)"
        ))


class TestIterFiles(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.mkdtemp()

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmpdir, ignore_errors=True)

    def _make_file(self, rel_path, content=""):
        full_path = os.path.join(self.tmpdir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w") as f:
            f.write(content)
        return full_path

    def test_yields_single_file_directly(self):
        path = self._make_file("auth.py", "token = 'abc'")
        result = list(iter_files([path], None))
        self.assertEqual(result, [path])

    def test_yields_all_files_in_directory(self):
        f1 = self._make_file("src/a.py", "")
        f2 = self._make_file("src/b.py", "")
        result = list(iter_files([self.tmpdir], None))
        self.assertIn(f1, result)
        self.assertIn(f2, result)

    def test_skips_skip_dirs(self):
        good = self._make_file("src/good.py", "")
        self._make_file("node_modules/evil.js", "os.system('rm -rf')")
        self._make_file(".git/config", "secret = 'xyz'")
        result = list(iter_files([self.tmpdir], None))
        self.assertIn(good, result)
        self.assertFalse(any("node_modules" in p for p in result))
        self.assertFalse(any(".git" in p for p in result))

    def test_applies_extension_filter(self):
        py_file = self._make_file("src/app.py", "")
        self._make_file("src/app.js", "")
        result = list(iter_files([self.tmpdir], [".py"]))
        self.assertIn(py_file, result)
        self.assertFalse(any(p.endswith(".js") for p in result))

    def test_yields_file_with_no_filter(self):
        py_file = self._make_file("main.py", "")
        js_file = self._make_file("main.js", "")
        result = list(iter_files([self.tmpdir], None))
        self.assertIn(py_file, result)
        self.assertIn(js_file, result)

    def test_empty_directory_yields_nothing(self):
        result = list(iter_files([self.tmpdir], None))
        self.assertEqual(result, [])

    def test_handles_multiple_skip_dirs(self):
        good = self._make_file("app/views.py", "")
        for skip in ["venv", "__pycache__", "dist", ".next"]:
            self._make_file(f"{skip}/something.py", "")
        result = list(iter_files([self.tmpdir], None))
        self.assertIn(good, result)
        for skip in ["venv", "__pycache__", "dist", ".next"]:
            self.assertFalse(any(f"/{skip}/" in p for p in result))


class TestScanFile(unittest.TestCase):
    def _make_temp_file(self, content, suffix=".py"):
        fd, path = tempfile.mkstemp(suffix=suffix)
        with os.fdopen(fd, "w") as f:
            f.write(content)
        return path

    def tearDown(self):
        pass  # Individual tests clean up their own files

    def test_returns_empty_for_clean_file(self):
        path = self._make_temp_file('x = process.env.API_KEY\n')
        try:
            hits = scan_file(path, CHECKS)
            self.assertEqual(hits, [])
        finally:
            os.unlink(path)

    def test_detects_hardcoded_secret(self):
        path = self._make_temp_file('api_key = "realkey12345678"\n')
        try:
            hits = scan_file(path, CHECKS)
            categories = [h[1] for h in hits]
            self.assertIn("hardcoded-secret", categories)
        finally:
            os.unlink(path)

    def test_detects_os_system(self):
        path = self._make_temp_file("os.system('ls')\n")
        try:
            hits = scan_file(path, CHECKS)
            categories = [h[1] for h in hits]
            self.assertIn("command-injection", categories)
        finally:
            os.unlink(path)

    def test_returns_correct_line_number(self):
        content = "x = 1\napi_key = 'realvalue1234'\nz = 3\n"
        path = self._make_temp_file(content)
        try:
            hits = scan_file(path, CHECKS)
            linenos = [h[0] for h in hits]
            self.assertIn(2, linenos)
        finally:
            os.unlink(path)

    def test_skips_file_larger_than_max(self):
        path = self._make_temp_file("api_key = 'realvalue1234'\n" * 100000)
        try:
            if os.path.getsize(path) > MAX_FILE_BYTES:
                hits = scan_file(path, CHECKS)
                self.assertEqual(hits, [])
        finally:
            os.unlink(path)

    def test_handles_unicode_decode_error_gracefully(self):
        fd, path = tempfile.mkstemp(suffix=".bin")
        with os.fdopen(fd, "wb") as f:
            f.write(b"\xff\xfe" + b"\x00" * 100)
        try:
            # Should not raise — returns empty list on decode error
            hits = scan_file(path, CHECKS)
            self.assertIsInstance(hits, list)
        finally:
            os.unlink(path)

    def test_returns_hit_tuple_structure(self):
        path = self._make_temp_file('os.system("ls")\n')
        try:
            hits = scan_file(path, CHECKS)
            self.assertTrue(len(hits) > 0)
            lineno, cat_id, severity, fix, content = hits[0]
            self.assertIsInstance(lineno, int)
            self.assertIsInstance(cat_id, str)
            self.assertIsInstance(severity, str)
            self.assertIsInstance(fix, str)
            self.assertIsInstance(content, str)
        finally:
            os.unlink(path)

    def test_filters_by_active_checks(self):
        # File has command injection AND xss — only run xss check
        path = self._make_temp_file(
            'os.system("ls")\nelement.innerHTML = data\n'
        )
        try:
            xss_only = [c for c in CHECKS if c[0] == "xss"]
            hits = scan_file(path, xss_only)
            categories = [h[1] for h in hits]
            self.assertIn("xss", categories)
            self.assertNotIn("command-injection", categories)
        finally:
            os.unlink(path)

    def test_strips_whitespace_from_content(self):
        path = self._make_temp_file('    os.system("ls")    \n')
        try:
            hits = scan_file(path, CHECKS)
            contents = [h[4] for h in hits]
            self.assertTrue(any(not c.startswith(" ") and not c.endswith(" ") for c in contents))
        finally:
            os.unlink(path)


class TestChecksMetadata(unittest.TestCase):
    """Verify the CHECKS list structure and completeness."""

    EXPECTED_CATEGORIES = {
        "hardcoded-secret",
        "sql-injection",
        "command-injection",
        "xss",
        "csrf-hint",
        "weak-crypto",
        "insecure-randomness",
        "insecure-deserialization",
        "debug-or-cors-misconfig",
        "mass-assignment",
        "weak-token-storage",
        "jwt-no-expiry",
        "sensitive-logging",
        "unsafe-upload-naming",
        "path-traversal",
    }

    VALID_SEVERITIES = {"critical", "high", "medium", "info"}

    def test_all_expected_categories_present(self):
        actual = {c[0] for c in CHECKS}
        self.assertEqual(actual, self.EXPECTED_CATEGORIES)

    def test_each_check_has_four_elements(self):
        for check in CHECKS:
            self.assertEqual(len(check), 4, f"Check {check[0]} must have 4 elements")

    def test_all_severities_are_valid(self):
        for cat_id, severity, fn, fix in CHECKS:
            self.assertIn(severity, self.VALID_SEVERITIES,
                          f"Check '{cat_id}' has invalid severity '{severity}'")

    def test_all_functions_are_callable(self):
        for cat_id, severity, fn, fix in CHECKS:
            self.assertTrue(callable(fn), f"Check '{cat_id}' function is not callable")

    def test_all_fix_messages_are_non_empty(self):
        for cat_id, severity, fn, fix in CHECKS:
            self.assertTrue(fix.strip(), f"Check '{cat_id}' fix message is empty")

    def test_no_duplicate_category_ids(self):
        ids = [c[0] for c in CHECKS]
        self.assertEqual(len(ids), len(set(ids)), "Duplicate category IDs found in CHECKS")


class TestSkipDirs(unittest.TestCase):
    def test_contains_common_skip_dirs(self):
        for d in ["node_modules", ".git", "venv", "__pycache__", "dist", "build"]:
            self.assertIn(d, SKIP_DIRS)

    def test_contains_frontend_skip_dirs(self):
        for d in [".next", ".vscode", ".idea"]:
            self.assertIn(d, SKIP_DIRS)


class TestLowSignalPathHints(unittest.TestCase):
    def test_contains_test_hint(self):
        self.assertIn("test", LOW_SIGNAL_PATH_HINTS)

    def test_contains_spec_hint(self):
        self.assertIn("spec", LOW_SIGNAL_PATH_HINTS)

    def test_contains_fixture_hint(self):
        self.assertIn("fixture", LOW_SIGNAL_PATH_HINTS)

    def test_contains_example_hint(self):
        self.assertIn(".example", LOW_SIGNAL_PATH_HINTS)


class TestMaxFileBytes(unittest.TestCase):
    def test_max_file_bytes_is_2mb(self):
        self.assertEqual(MAX_FILE_BYTES, 2 * 1024 * 1024)


class TestEdgeCases(unittest.TestCase):
    """Boundary and regression tests for unusual inputs."""

    def test_check_hardcoded_secret_empty_line(self):
        self.assertFalse(check_hardcoded_secret(""))

    def test_check_sql_injection_empty_line(self):
        self.assertFalse(check_sql_injection(""))

    def test_check_command_injection_empty_line(self):
        self.assertFalse(check_command_injection(""))

    def test_check_xss_empty_line(self):
        self.assertFalse(check_xss(""))

    def test_check_csrf_missing_hint_empty_line(self):
        self.assertFalse(check_csrf_missing_hint(""))

    def test_check_hardcoded_secret_none_like_string(self):
        # Should not raise even with unusual input
        self.assertFalse(check_hardcoded_secret("# just a comment"))

    def test_check_insecure_deserialization_empty_line(self):
        self.assertFalse(check_insecure_deserialization(""))

    def test_check_debug_or_cors_misconfig_empty_line(self):
        self.assertFalse(check_debug_or_cors_misconfig(""))

    def test_check_jwt_no_expiry_no_jwt_sign(self):
        # A line with expiresIn but no jwt.sign should not trigger
        self.assertFalse(check_jwt_no_expiry("const opts = { expiresIn: '1h' }"))

    def test_check_sensitive_logging_empty_line(self):
        self.assertFalse(check_sensitive_logging(""))

    def test_aws_key_too_short(self):
        # AKIA with fewer than 16 chars after it should not match
        self.assertFalse(check_hardcoded_secret("AKIA1234"))

    def test_github_pat_too_short(self):
        # ghp_ with fewer than 36 chars after
        self.assertFalse(check_hardcoded_secret("ghp_" + "A" * 10))

    def test_check_path_traversal_empty_line(self):
        self.assertFalse(check_path_traversal(""))

    def test_check_mass_assignment_empty_line(self):
        self.assertFalse(check_mass_assignment(""))

    def test_check_weak_token_storage_empty_line(self):
        self.assertFalse(check_weak_token_storage(""))

    def test_check_unsafe_upload_naming_empty_line(self):
        self.assertFalse(check_unsafe_upload_naming(""))

    def test_check_weak_crypto_empty_line(self):
        self.assertFalse(check_weak_crypto_for_secrets(""))

    def test_check_insecure_randomness_empty_line(self):
        self.assertFalse(check_insecure_randomness_for_tokens(""))

    def test_contains_any_handles_unicode(self):
        # Should not raise on unicode content
        result = contains_any("pàssword = 'secret'", ["password"])
        self.assertIsInstance(result, bool)

    def test_scan_file_nonexistent_path(self):
        # Should not raise, return empty list
        hits = scan_file("/nonexistent/path/file.py", CHECKS)
        self.assertEqual(hits, [])

    def test_iter_files_with_multiple_ext_filters(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            py_file = os.path.join(tmpdir, "app.py")
            js_file = os.path.join(tmpdir, "app.js")
            rb_file = os.path.join(tmpdir, "app.rb")
            for p in [py_file, js_file, rb_file]:
                open(p, "w").close()

            result = list(iter_files([tmpdir], [".py", ".js"]))
            self.assertIn(py_file, result)
            self.assertIn(js_file, result)
            self.assertNotIn(rb_file, result)


if __name__ == "__main__":
    unittest.main()