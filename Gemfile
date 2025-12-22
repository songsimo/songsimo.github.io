# frozen_string_literal: true

source "https://rubygems.org"

gemspec

gem "html-proofer", "~> 5.0", group: :test

platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:windows]

group :jekyll_plugins do
  gem "jekyll-include-cache"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
  gem "jekyll-redirect-from"
  gem "jekyll-archives"
  gem "jekyll-sitemap"
  gem "jekyll-mermaid"
end

gem "sass-embedded", "~> 1.70" # 최신 Sass 컴파일러
gem "webrick"                  # Ruby 3.0 이상에서 필요한 기본 서버 라이브러리
