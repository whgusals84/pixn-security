param(
  [Parameter(Mandatory = $false)]
  [string]$PublicRoot = (Join-Path $PSScriptRoot '..\public')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$resolvedPublicRoot = [IO.Path]::GetFullPath($PublicRoot)
$workRoot = Join-Path $resolvedPublicRoot '.brand-build'
if (-not $workRoot.StartsWith($resolvedPublicRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Brand build directory must stay inside PublicRoot.'
}
New-Item -ItemType Directory -Path $workRoot -Force | Out-Null

function New-PixnBitmap {
  param(
    [int]$Width,
    [int]$Height,
    [string]$OutputPath,
    [switch]$SocialCard
  )

  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::FromArgb(4, 4, 5))

  $borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(39, 39, 43), [Math]::Max(1, $Width / 600))
  $graphics.DrawRectangle($borderPen, 18, 18, $Width - 37, $Height - 37)

  if ($SocialCard) {
    $markFont = [System.Drawing.Font]::new('Segoe UI', 172, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $wordFont = [System.Drawing.Font]::new('Segoe UI', 45, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $captionFont = [System.Drawing.Font]::new('Segoe UI', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $markBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(242, 242, 239))
    $wordBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(164, 164, 159))
    $captionBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(124, 124, 116))
    $graphics.DrawString('PX', $markFont, $markBrush, 84, 118)
    $graphics.DrawString('PIXN', $wordFont, $wordBrush, 91, 350)
    $graphics.DrawString('WEB SECURITY', $captionFont, $captionBrush, 94, 430)
    $markFont.Dispose()
    $wordFont.Dispose()
    $captionFont.Dispose()
    $markBrush.Dispose()
    $wordBrush.Dispose()
    $captionBrush.Dispose()
  }
  else {
    $fontSize = [Math]::Floor([Math]::Min($Width, $Height) * 0.42)
    $markFont = [System.Drawing.Font]::new('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $markBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(242, 242, 239))
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString('PX', $markFont, $markBrush, [System.Drawing.RectangleF]::new(0, 0, $Width, $Height), $format)
    $markFont.Dispose()
    $markBrush.Dispose()
    $format.Dispose()
  }

  New-Item -ItemType Directory -Path ([IO.Path]::GetDirectoryName($OutputPath)) -Force | Out-Null
  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $borderPen.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$socialCard = Join-Path $workRoot 'og-placeholder.png'
New-PixnBitmap -Width 1200 -Height 630 -OutputPath $socialCard -SocialCard

$iconTargets = @(
  @{ Width = 512; Height = 512; Path = (Join-Path $resolvedPublicRoot 'images\h.png') },
  @{ Width = 512; Height = 512; Path = (Join-Path $resolvedPublicRoot 'icons\web-app-manifest-512x512.png') },
  @{ Width = 192; Height = 192; Path = (Join-Path $resolvedPublicRoot 'icons\web-app-manifest-192x192.png') },
  @{ Width = 180; Height = 180; Path = (Join-Path $resolvedPublicRoot 'icons\apple-touch-icon.png') },
  @{ Width = 96; Height = 96; Path = (Join-Path $resolvedPublicRoot 'icons\favicon-96x96.png') }
)
foreach ($target in $iconTargets) {
  New-PixnBitmap -Width $target.Width -Height $target.Height -OutputPath $target.Path
}
Copy-Item -LiteralPath (Join-Path $resolvedPublicRoot 'icons\favicon-96x96.png') -Destination (Join-Path $resolvedPublicRoot 'icons\favicon.ico') -Force

Get-ChildItem -LiteralPath (Join-Path $resolvedPublicRoot 'og-images') -Recurse -File -Filter '*.png' | ForEach-Object {
  Copy-Item -LiteralPath $socialCard -Destination $_.FullName -Force
}

Remove-Item -LiteralPath $workRoot -Recurse -Force
Write-Output 'PIXN compatibility icons and social preview assets generated.'
