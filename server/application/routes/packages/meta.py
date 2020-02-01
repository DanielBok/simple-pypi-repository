import json

from flask import request


class UserAgent:
    def __init__(self):
        client, sys_info = request.user_agent.string.split(' ', 1)
        self.is_pip: bool = client.lower().startswith('pip')
        self._data = json.loads(sys_info) if self.is_pip else {}

    @property
    def implementation(self) -> str:
        return self._data['implementation']['name'].lower() if self.is_pip else ''

    @property
    def python_version(self) -> str:
        return self._data['implementation']['version'].lower() if self.is_pip else ''

    @property
    def platform(self) -> str:
        return self._data['system']['name'].lower() if self.is_pip else ''

    @property
    def platform_version(self) -> str:
        return self._data['system']['release'].lower() if self.is_pip else ''

    @property
    def is_64_bit(self) -> bool:
        return self._data['cpu'].endswith("64")
