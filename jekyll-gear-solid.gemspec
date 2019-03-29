# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "jekyll-gear-solid"
  spec.version       = "0.1.0"
  spec.authors       = ["theTaikun"]
  spec.email         = ["thub.com_ryqmkwxibutypwg68hdzlku4st40@15turns.com"]

  spec.summary       = "Custom Jekyll theme."
  spec.homepage      = "https://github.com/theTaikun/jekyll-gear-solid.git"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", "~> 3.8"

  spec.add_development_dependency "bundler", "~> 1.16"
  spec.add_development_dependency "rake", "~> 12.0"
end
