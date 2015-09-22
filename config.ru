require 'rubygems'
require 'bundler'
Bundler.setup
Bundler.require(:default)
use Rack::Chunked
use Rack::Static,
  :urls => ["/style", "/images", "/js"],
  :root => "public"

Rack::Mime::MIME_TYPES[".appcache"] = "text/cache-manifest"

run lambda { |env|
  path = env['PATH_INFO']
  case path
  when ''
  when '/'
    [
      200,
      {
        'Content-Type'  => 'text/html',
        'Cache-Control' => 'public, max-age=86400'
      },
      File.open('public/index.html', File::RDONLY)
    ]
  when '/prima.appcache'
    [
      200,
      {
        'Content-Type' => 'text/cache-manifest',
        'ExpiresDefault' => 'access plus 0 seconds'
      },
      File.open('public/prima.appcache', File::RDONLY)
    ]
  else
    [
      404,
      {},
      File.open('public/404.html', File::RDONLY)
    ]
  end
}
