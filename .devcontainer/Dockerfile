##
##
#   python3 \
#   make \
#   g++ \
FROM node:18-buster-slim as node
LABEL maintainer="Coneyware"

ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP.UTF-8 \
    LC_ALL="ja_JP.UTF-8"

RUN set -x \
 && apt update \
 && apt install -y \
   git \
   locales \
 && sed -i -E 's/# (ja_JP.UTF-8)/\1/' /etc/locale.gen \
 && locale-gen \
 && update-locale LANG=ja_JP.UTF-8 \
 && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

FROM node as x64
LABEL maintainer="Coneyware"

ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP.UTF-8 \
    LC_ALL="ja_JP.UTF-8"

RUN set -x \
 && apt update \
 && apt install -y \
   git \
   locales \
   curl \
   zip \
 && sed -i -E 's/# (ja_JP.UTF-8)/\1/' /etc/locale.gen \
 && locale-gen \
 && update-locale LANG=ja_JP.UTF-8 \
 && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
 && curl -fsSL https://deno.land/install.sh | sh \
 && echo 'export DENO_INSTALL="~/.deno"' >> ~/.bashrc \
 && echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.bashrc

FROM node as aarch64
LABEL maintainer="Coneyware"

ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP.UTF-8 \
    LC_ALL="ja_JP.UTF-8"

RUN set -x \
 && apt update \
 && apt install -y \
   git \
   locales \
   curl \
   zip \
 && sed -i -E 's/# (ja_JP.UTF-8)/\1/' /etc/locale.gen \
 && locale-gen \
 && update-locale LANG=ja_JP.UTF-8 \
 && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
 && curl -LJO https://github.com/LukeChannings/deno-arm64/releases/download/v1.30.3/deno-linux-arm64.zip \
 && mkdir -p ~/.deno/bin \
 && unzip deno-linux-arm64.zip -d ~/.deno/bin \
 && echo 'export DENO_INSTALL="~/.deno"' >> ~/.bashrc \
 && echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.bashrc \
 && rm deno-linux-arm64.zip
